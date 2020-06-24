import React, { useRef, useState } from "react";
import { Map, TileLayer, ZoomControl } from "react-leaflet";

import "./ModernMap.css";

function ModernMap() {
  const map = useRef(null);
  const [center] = useState({ lat: 32.039579, lng: 118.8 });
  const [zoom] = useState(13);

  return (
    <section className="modern">
      <Map ref={map} center={center} zoom={zoom} zoomControl={false}>
        <TileLayer
          attribution='&amp;copy <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
      </Map>
    </section>
  );
}

export default ModernMap;
