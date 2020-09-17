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
import xyBoundsFilter from '../util/xyBoundsFilter';
import latlngBoundsReducer from '../util/latlngBoundsReducer';

import './Explorer.css';

const PLACES_PATH = 'geojson/maokun-places.geo.json';
const PATHS_PATH = 'geojson/maokun-paths.geo.json';
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

function Explorer(props) {
  const modernMapRef = useRef(null);
  const [places, setPlaces] = useState({ features: [] });
  const [paths, setPaths] = useState({ features: [] });
  const [maokunCenter, setMaokunCenter] = useState(null);
  const [glossary, setGlossary] = useState(false);
  const [about, setAbout] = useState(false);
  const [legend, setLegend] = useState(false);
  const [selected, setSelected] = useState({});
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [bounds, setBounds] = useState({
    _northEast: [109336, 400],
    _southWest: [101696, 3320],
  });

  useEffect(() => {
    fetch(PLACES_PATH)
      .then((res) => res.json())
      .then(setPlaces);
    fetch(PATHS_PATH)
      .then((res) => res.json())
      .then(setPaths);
  }, []);

  function handleMove(xyBounds) {
    setBounds(xyBounds);

    if (!modernMapRef.current) return;

    const visiblePoints = places.features.filter(xyBoundsFilter(xyBounds));
    if (visiblePoints.length === 0) return;

    const latlngBounds = visiblePoints.reduce(latlngBoundsReducer, [
      [90, 180],
      [-90, -180],
    ]);

    modernMapRef.current.leafletElement.fitBounds(latlngBounds);
  }

  function handlePrefsChange(key, value) {
    setPrefs(Object.assign({}, prefs, { [key]: value }));
  }

  function handleSelect(id, type) {
    setSelected({ [type]: id });
  }

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
          center={maokunCenter}
          places={places}
          paths={paths}
          categories={prefs.categories}
          labelLocations={prefs.labelLocations}
          onMove={handleMove}
          onSelect={handleSelect}
        />
        <ModernMap
          ref={modernMapRef}
          places={places}
          paths={paths}
          labelLocations={prefs.labelLocations}
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
        onClose={() => setSelected({})}
      />
    </React.Fragment>
  );
}

export default Explorer;
