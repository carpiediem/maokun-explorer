import React, { useState, useEffect } from "react";
import SplitPane from "react-split-pane";

import MaoKunMap from "../components/MaoKunMap";
import ModernMap from "../components/ModernMap";
import AboutDialog from "../components/AboutDialog";
import Menu from "../components/Menu";
import PointDetails from "../components/PointDetails";

import "./Explorer.css";

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
    "water body": true,
    descriptor: true
  },
  labelLocations: false
};

function Explorer(props) {
  const [geojson, setGeojson] = useState({ features: [] });
  const [about, setAbout] = React.useState(false);
  const [prefs, setPrefs] = React.useState(DEFAULT_PREFS);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("maokun.geo.json");

      setGeojson(await res.json());
    };

    fetchData();
  }, []);

  function onMove(zoomifyBounds) {
    console.log("zoomifyBounds:", zoomifyBounds);
  }

  return (
    <React.Fragment>
      <SplitPane
        split="horizontal"
        minSize={50}
        defaultSize={
          parseInt(localStorage.getItem("splitPos"), 10) ||
          window.innerHeight / 2
        }
        onChange={size => localStorage.setItem("splitPos", size)}
        className={prefs.lockPanes ? "locked" : ""}
      >
        <MaoKunMap
          geojson={geojson}
          categories={prefs.categories}
          labelLocations={prefs.labelLocations}
          onMove={onMove}
        />
        <ModernMap
          geojson={geojson}
          categories={prefs.categories}
          labelLocations={prefs.labelLocations}
        />
      </SplitPane>
      <AboutDialog open={about} handleClose={() => setAbout(false)} />
      <Menu
        prefs={prefs}
        onChange={(key, value) =>
          setPrefs(Object.assign({}, prefs, { [key]: value }))
        }
        onAboutClick={() => setAbout(true)}
      />
      <PointDetails geojson={geojson} id={492} />
    </React.Fragment>
  );
}

export default Explorer;
