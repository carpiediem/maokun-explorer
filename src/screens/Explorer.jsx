import React, { useState, useEffect } from "react";
import SplitPane from "react-split-pane";

import MaoKunMap from "../components/MaoKunMap";
import ModernMap from "../components/ModernMap";
import AboutDialog from "../components/AboutDialog";
import Menu from "../components/Menu";
import PointDetails from "../components/PointDetails";

import "./Explorer.css";

function Explorer(props) {
  const [geojson, setGeojson] = useState({ features: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("maokun.geo.json");

      setGeojson(await res.json());
    };

    fetchData();
  }, []);

  //     defaultSize={parseInt(
  //   localStorage.getItem("splitPos"),
  //   window.innerHeight / 2
  // )}

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
      >
        <MaoKunMap />
        <ModernMap />
      </SplitPane>
      <AboutDialog />
      <Menu />
      <PointDetails geojson={geojson} id={492} />
    </React.Fragment>
  );
}

export default Explorer;
