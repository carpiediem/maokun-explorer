/* global gtag */

import React, { useState, useEffect, useRef } from 'react';
import SplitPane from 'react-split-pane';

import MaoKunMap from '../components/MaoKunMap';
import ModernMap from '../components/ModernMap';
import MiniMap from '../components/MiniMap';
import AboutDialog from '../components/AboutDialog';
import LegendDialog from '../components/LegendDialog';
import GlossaryDialog from '../components/GlossaryDialog';
import Menu from '../components/Menu';
import PointDetails from '../components/PointDetails';
import PathDetails from '../components/PathDetails';
import xyBoundsFilter from '../util/xyBoundsFilter';
import latlngBoundsReducer from '../util/latlngBoundsReducer';

import './Explorer.css';
import xyToLeaflet from '../util/xyToLeaflet';

const PLACES_PATH = 'data/maokun-places.geo.json';
const PATHS_PATH = 'data/maokun-paths.geo.json';
const DEFAULT_PREFS = {
  lockPanes: false,
  syncMaps: true,
  categories: {
    town: true,
    area: true,
    building: true,
    mountain: true,
    peninsula: true,
    island: true,
    'water body': true,
    descriptor: true,
  },
  labelLocations: false,
};
const MAOKUN_SIZE = {
  coordinates: { lat: -8.326171875, lng: 211.720703125 },
  zoomify: [108401, 4263],
};
const BOUNDS_MARGIN = 0.08; // degrees latitude or longitude

function Explorer(props) {
  const maokunMapRef = useRef(null);
  const modernMapRef = useRef(null);
  const [draggedMap, setDraggedMap] = useState(false);
  const [places, setPlaces] = useState([]);
  const [paths, setPaths] = useState([]);
  const [maokunCenter, setMaokunCenter] = useState(null);
  const [glossary, setGlossary] = useState(
    window.location.hash === '#/glossary'
  );
  const [about, setAbout] = useState(window.location.hash === '#/about');
  const [legend, setLegend] = useState(window.location.hash === '#/legend');
  const [selected, setSelected] = useState({});
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [bounds, setBounds] = useState({
    _northEast: [109336, 400],
    _southWest: [101696, 3320],
  });

  useEffect(() => {
    fetch(PLACES_PATH)
      .then((res) => res.json())
      .then(({ features }, index) => {
        setPlaces(features);

        const placeMatch = /#\/place\/(\d+)/.exec(window.location.hash);
        if (!placeMatch) return;

        const id = parseInt(placeMatch[1], 10);
        const place = features.find((p) => p.properties.id === id);
        if (!place) return;

        setSelected({ point: id });
        const xy = place.geometry.zoomify;
        const margin = 500;

        maokunMapRef.current.leafletElement.fitBounds(
          xyToLeaflet([
            [xy[0] - margin, xy[1] - margin],
            [xy[0] + margin, xy[1] + margin],
          ])
        );
      });
    fetch(PATHS_PATH)
      .then((res) => res.json())
      .then(({ features }) => setPaths(features));
  }, []);

  function handleMove(xyBounds) {
    if (selected.point || selected.path) return;

    if (!draggedMap) {
      setDraggedMap(true);
      gtag('event', 'first map drag', {
        event_category: 'UX',
        event_label: 'first map drag',
        // 'value': <value>
      });
    }

    setBounds(xyBounds);

    if (!modernMapRef.current || !prefs.syncMaps) return;

    const visiblePoints = places
      .filter(({ properties }) => prefs.categories[properties.category])
      .filter(xyBoundsFilter(xyBounds));
    if (visiblePoints.length === 0) return;

    const latlngBounds = visiblePoints.reduce(latlngBoundsReducer, [
      [90, 180],
      [-90, -180],
    ]);

    modernMapRef.current.leafletElement.fitBounds([
      [latlngBounds[0][0] - BOUNDS_MARGIN, latlngBounds[0][1] - BOUNDS_MARGIN],
      [latlngBounds[1][0] + BOUNDS_MARGIN, latlngBounds[1][1] + BOUNDS_MARGIN],
    ]);
  }

  function handlePrefsChange(key, value) {
    setPrefs(Object.assign({}, prefs, { [key]: value }));
  }

  function handleSelect(id, type, source) {
    gtag('event', type === 'point' ? 'place selection' : 'path selection', {
      event_category: 'UX',
      event_label: source,
      value: id,
    });

    Array.from(
      document.querySelectorAll('path.circle-marker, path.path')
    ).forEach((f) => f.classList.remove('selected'));
    Array.from(
      document.querySelectorAll('.modern path.circle-marker, path.path')
    ).forEach((f) =>
      f.setAttribute(
        'd',
        f
          .getAttribute('d')
          .replace(
            'm-15,0a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 ',
            'a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 '
          )
      )
    );

    setSelected({ [type]: id });
    if (!id) return;

    if (type === 'point') {
      const { coordinates, zoomify } = places.find(
        (p) => p.properties.id === id
      ).geometry;

      // Recenter MaoKunMap
      if (source !== 'maokun') setMaokunCenter(xyToLeaflet(zoomify));

      // Add `selected` class to CirlceMarker component's <path> element
      Array.from(
        document.querySelectorAll(`path.circle-marker.id-${id}`)
      ).forEach((m) => m.classList.add('selected'));

      // Change marker radius from 5 to 20 in ModernMap
      const modernMarker = document.querySelector(
        `section.modern path.circle-marker.id-${id}`
      );
      if (!modernMarker) return;

      modernMarker.setAttribute(
        'd',
        modernMarker
          .getAttribute('d')
          .replace(
            'a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 ',
            'm-15,0a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 '
          )
      );

      // Recenter ModernMap
      if (source !== 'modern')
        modernMapRef.current.leafletElement.flyTo(
          [coordinates[1], coordinates[0]],
          9
        );
    }
  }

  const filteredPlaces = places.filter(
    ({ properties }) => prefs.categories[properties.category]
  );

  return (
    <React.Fragment>
      <SplitPane
        split="horizontal"
        minSize={50}
        defaultSize={
          parseInt(localStorage.getItem('splitPos'), 10) ||
          window.innerHeight / 2
        }
        onChange={(size) => localStorage.setItem('splitPos', size)}
        className={prefs.lockPanes ? 'locked' : ''}
      >
        <MaoKunMap
          ref={maokunMapRef}
          center={maokunCenter}
          places={filteredPlaces}
          paths={paths}
          categories={prefs.categories}
          labelLocations={prefs.labelLocations}
          onMove={handleMove}
          onSelect={handleSelect}
        />
        <ModernMap
          ref={modernMapRef}
          places={filteredPlaces}
          paths={paths}
          selected={selected}
          labelLocations={prefs.labelLocations}
          onSelect={handleSelect}
        />
      </SplitPane>
      <MiniMap
        bounds={bounds}
        onClick={({ xRatio, yRatio }) =>
          setMaokunCenter(
            xyToLeaflet([
              MAOKUN_SIZE.zoomify[0] * xRatio,
              MAOKUN_SIZE.zoomify[1] * yRatio,
            ])
          )
        }
      />
      <AboutDialog open={about} handleClose={() => setAbout(false)} />
      <LegendDialog open={legend} handleClose={() => setLegend(false)} />
      <GlossaryDialog open={glossary} handleClose={() => setGlossary(false)} />
      <Menu
        prefs={prefs}
        onChange={handlePrefsChange}
        onDialogClick={(key) => {
          gtag('event', 'dialog opened', {
            event_category: 'UX',
            event_label: 'dialog opened',
            value: key,
          });
          // TBD: measure view time

          switch (key) {
            case 'about':
              setAbout(true);
              break;
            case 'legend':
              setLegend(true);
              break;
            case 'glossary':
              setGlossary(true);
              break;
            default:
          }
        }}
      />
      <PointDetails
        places={places}
        id={selected.point}
        onSelect={handleSelect}
      />
      <PathDetails paths={paths} id={selected.path} onSelect={handleSelect} />
    </React.Fragment>
  );
}

export default Explorer;
