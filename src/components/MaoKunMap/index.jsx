import React, { useRef, useEffect } from "react";
import { CRS } from "leaflet";
import { Map, ZoomControl } from "react-leaflet";

import ZoomifyLayer from "./ZoomifyLayer";

import "./MaoKunMap.css";

const MAOKUN_URL =
  "https://barbierilow.faculty.history.ucsb.edu/Research/ZhengHeMapZoomify/ZhengHe/";
const MAOKUN_WIDTH = 108401; // (423 * 256) + 113
const MAOKUN_HEIGHT = 4263; // (16 * 256) + 167
const START_PIXEL = [105513, 1863];
const ATTRIBUTION =
  "<a href='https://en.wikipedia.org/wiki/Wubei_Zhi'>Mao Yuanyi</a> & <a href='https://barbierilow.faculty.history.ucsb.edu/Research/ZhengHeMapZoomify/ZhengHe.htm'>Prof. Anthony Barbieri</a>";

function MaoKunMap(props) {
  const map = useRef(null);
  const [center, setCenter] = React.useState({ lat: 0, lng: 0 });
  const [zoom] = React.useState(6);

  useEffect(() => {
    const maxZoom = Math.ceil(
      Math.max(Math.log2(MAOKUN_WIDTH / 256), Math.log2(MAOKUN_HEIGHT / 256))
    );
    map.current.edges = map.current.leafletElement.unproject(
      [MAOKUN_WIDTH, MAOKUN_HEIGHT],
      maxZoom
    );
    setCenter({
      lat: (START_PIXEL[1] / MAOKUN_HEIGHT) * map.current.edges.lat,
      lng: (START_PIXEL[0] / MAOKUN_WIDTH) * map.current.edges.lng
    });
  }, []);

  function handleMove(e) {
    const bounds = map.current.leafletElement.getBounds();

    if (!bounds || !map.current.edges) {
      console.log("map.current.edges:", map.current.edges);
      return;
    }

    props.onMove({
      _southWest: [
        (bounds._southWest.lng / map.current.edges.lng) * MAOKUN_WIDTH,
        (bounds._southWest.lat / map.current.edges.lat) * MAOKUN_HEIGHT
      ],
      _northEast: [
        (bounds._northEast.lng / map.current.edges.lng) * MAOKUN_WIDTH,
        (bounds._northEast.lat / map.current.edges.lat) * MAOKUN_HEIGHT
      ]
    });
  }

  return (
    <section className="maokun">
      <Map
        ref={map}
        crs={CRS.Simple}
        center={center}
        zoom={zoom}
        onMove={handleMove}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <ZoomifyLayer
          attribution={ATTRIBUTION}
          url={MAOKUN_URL}
          width={MAOKUN_WIDTH}
          height={MAOKUN_HEIGHT}
        />
      </Map>
    </section>
  );
}

export default MaoKunMap;
