import React, { useState, useEffect, useRef } from 'react';
import SplitPane from 'react-split-pane';

import Globe from '../../components/Globe';
import MaoKunMap from '../../components/MaoKunMap';
import ModernMap from '../../components/ModernMap';
import MiniMap from '../../components/MiniMap';
import IntroDialog from '../../components/IntroDialog';
import AboutDialog from '../../components/AboutDialog';
import LegendDialog from '../../components/LegendDialog';
import GlossaryDialog from '../../components/GlossaryDialog';
import NavigationDialog from '../../components/NavigationDialog';
import Menu from '../../components/Menu';
import PointDetails from '../../components/PointDetails';
import PathDetails from '../../components/PathDetails';

import './Explorer.css';
import getGeoJson from '../../util/getGeoJson';
import readHash from '../../util/readHash';
import MAOKUN_SIZE from '../../components/MaoKunMap/size.json';
import maokunCenterOn from '../../components/MaoKunMap/centerOn';
import modernCenterOn from '../../components/ModernMap/centerOn';

import applyPrefs from './applyPrefs';
import selectHof from './handleSelect';
import handleMaokunViewChange from './handleMaokunViewChange';
import handleModernViewChange from './handleModernViewChange';
import DEFAULT_PREFS from '../../components/Menu/default-preferences.json';

const PLACES_PATH = 'data/maokun-places.geo.json';
const PATHS_PATH = 'data/maokun-paths.geo.json';
const hashMatch = /^#\/(about|legend|glossary|navigation|place|path)/.exec(
  window.location.hash
);

function Explorer() {
  const maokunMapRef = useRef(null);
  const modernMapRef = useRef(null);
  const minimapFovRef = useRef(null);
  const globeFovRef = useRef(null);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [data, setData] = useState({ places: [], paths: [] });
  const [selected, setSelected] = useState({}); // CAN I GET RID OF THIS? WHY ISN'T MEMO KEEPING MODERNMAP FROM RERENDING
  const [dialog, setDialog] = useState(hashMatch ? hashMatch[1] : 'intro');

  const handleSelect = selectHof(setSelected, data, maokunMapRef, modernMapRef);

  useEffect(() => {
    // Request data
    Promise.all([getGeoJson(PLACES_PATH), getGeoJson(PATHS_PATH)]).then(
      ([places, paths]) => {
        setData({ places, paths });

        // Initialize to match URL hash
        const toSelect = readHash(places, paths, maokunMapRef, modernMapRef);
        if (toSelect !== {}) setSelected(toSelect);
      }
    );
  }, []);

  function handlePrefsChange(key, value) {
    setPrefs(Object.assign({}, prefs, { [key]: value }));
  }

  const filteredPlaces = data.places.filter(
    applyPrefs(prefs.categories, prefs.voyages)
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
          places={filteredPlaces}
          paths={data.paths}
          onViewChange={handleMaokunViewChange(
            modernMapRef,
            minimapFovRef,
            filteredPlaces,
            selected
          )}
          onSelect={handleSelect}
        />
        <ModernMap
          ref={modernMapRef}
          places={filteredPlaces}
          paths={data.paths}
          onViewChange={handleModernViewChange}
          labelLocations={prefs.labelLocations}
          onSelect={handleSelect}
        />
      </SplitPane>
      <MiniMap
        fovRef={minimapFovRef}
        onClick={({ xRatio, yRatio }) => {
          handleSelect();
          maokunCenterOn(maokunMapRef, [
            MAOKUN_SIZE.zoomify[0] * xRatio,
            MAOKUN_SIZE.zoomify[1] * yRatio,
          ]);
        }}
      />
      <Globe fovRef={globeFovRef} />
      <IntroDialog
        open={dialog === 'intro'}
        handleClose={() => {
          setDialog(null);
          maokunCenterOn(maokunMapRef);
          modernCenterOn(modernMapRef);
        }}
      />
      <AboutDialog
        open={dialog === 'about'}
        handleClose={() => setDialog(null)}
      />
      <LegendDialog
        open={dialog === 'legend'}
        handleClose={() => setDialog(null)}
      />
      <GlossaryDialog
        open={dialog === 'glossary'}
        handleClose={() => setDialog(null)}
      />
      <NavigationDialog
        open={dialog === 'navigation'}
        handleClose={() => setDialog(null)}
      />
      <Menu
        prefs={prefs}
        onChange={handlePrefsChange}
        setDialog={setDialog}
        setPrefs={setPrefs}
      />
      <PointDetails
        places={data.places}
        id={selected.point}
        onSelect={handleSelect}
      />
      <PathDetails
        paths={data.paths}
        id={selected.path}
        onSelect={handleSelect}
      />
    </React.Fragment>
  );
}

export default Explorer;
