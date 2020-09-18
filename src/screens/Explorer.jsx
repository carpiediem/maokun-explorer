import React, { useState, useEffect, useRef } from 'react';
import SplitPane from 'react-split-pane';

import MaoKunMap from '../components/MaoKunMap';
import ModernMap from '../components/ModernMap';
import MiniMap from '../components/MiniMap';
import GlossaryDialog from '../components/GlossaryDialog';
import AboutDialog from '../components/AboutDialog';
import LegendDialog from '../components/LegendDialog';
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
const BOUNDS_MARGIN = 0.08; // degrees latitude or longitude

function Explorer(props) {
  const maokunMapRef = useRef(null);
  const modernMapRef = useRef(null);
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
      .then(({ features }) => {
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

  function handleSelect(id, type) {
    Array.from(
      document.querySelectorAll('path.circle-marker, path.path')
    ).forEach((f) => f.classList.remove('selected'));

    setSelected({ [type]: id });
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
          selected={selected}
          onMove={handleMove}
          onSelect={handleSelect}
        />
        <ModernMap
          ref={modernMapRef}
          places={filteredPlaces}
          paths={paths}
          labelLocations={prefs.labelLocations}
          selected={selected}
          onSelect={handleSelect}
        />
      </SplitPane>
      <MiniMap bounds={bounds} onClick={setMaokunCenter} />
      <GlossaryDialog open={glossary} handleClose={() => setGlossary(false)} />
      <AboutDialog open={about} handleClose={() => setAbout(false)} />
      <LegendDialog open={legend} handleClose={() => setLegend(false)} />
      <Menu
        prefs={prefs}
        onChange={handlePrefsChange}
        onDialogClick={(key) => {
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
        onClose={() => handleSelect()}
      />
      <PathDetails
        paths={paths}
        id={selected.path}
        onClose={() => handleSelect()}
      />
    </React.Fragment>
  );
}

export default Explorer;
