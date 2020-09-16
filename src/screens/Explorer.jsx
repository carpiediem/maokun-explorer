import React, { useState, useEffect } from "react";
import SplitPane from "react-split-pane";

import MaoKunMap from "../components/MaoKunMap";
import ModernMap from "../components/ModernMap";
import MiniMap from "../components/MiniMap";
import GlossaryDialog from "../components/GlossaryDialog";
import AboutDialog from "../components/AboutDialog";
import LegendDialog from "../components/LegendDialog";
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
    descriptor: true,
  },
  labelLocations: false,
};

function Explorer(props) {
  const [geojson, setGeojson] = useState({ features: [] });
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
  const [pointIds, setPointIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('geojson/maokun-places.geo.json');

      setGeojson(await res.json());
    };

    fetchData();
  }, []);

  function handleMove(newBounds) {
    setBounds(newBounds);

    // console.log(newBounds);
    const visiblePoints = geojson.features
      .filter(
        (m) =>
          m.geometry.type === "Point" &&
          m.geometry.zoomify[0] >= bounds._southWest[0] &&
          m.geometry.zoomify[0] <= bounds._northEast[0] &&
          m.geometry.zoomify[1] >= bounds._northEast[1] &&
          m.geometry.zoomify[1] <= bounds._southWest[1]
      )
      .map((m) => m.properties.id);
    setPointIds(visiblePoints);

    // console.log(visiblePoints);
  }

  function handlePrefsChange(key, value) {
    setPrefs(Object.assign({}, prefs, { [key]: value }));

    setPointIds([]);
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
          parseInt(localStorage.getItem("splitPos"), 10) ||
          window.innerHeight / 2
        }
        onChange={(size) => localStorage.setItem("splitPos", size)}
        className={prefs.lockPanes ? "locked" : ""}
      >
        <MaoKunMap
          center={maokunCenter}
          geojson={geojson}
          categories={prefs.categories}
          labelLocations={prefs.labelLocations}
          onMove={handleMove}
          onSelect={handleSelect}
        />
        <ModernMap
          geojson={geojson}
          pointIds={pointIds}
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
            case "about":
              setAbout(true);
              break;
            case "legend":
              setLegend(true);
              break;
            case "glossary":
              setGlossary(true);
              break;
          }
        }}
      />
      <PointDetails
        geojson={geojson}
        id={selected.point}
        onClose={() => setSelected({})}
      />
    </React.Fragment>
  );
}

export default Explorer;
