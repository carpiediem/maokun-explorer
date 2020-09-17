import React, { useState, forwardRef } from 'react';
import { Map, TileLayer, ZoomControl, Marker, Polyline } from 'react-leaflet';
import { identified, unidentified, unknown } from '../MaoKunMap/icons';

import './ModernMap.css';

const ModernMap = forwardRef((props, ref) => {
  const [center] = useState({ lat: 32.039579, lng: 118.8 });
  const [zoom] = useState(13);

  const markers = props.places.features
    .filter((m) => m.geometry.type === 'Point' && m.geometry.coordinates.length)
    .map((m) => ({
      key: m.properties.id,
      icon:
        (m.geometry.coordinates.length ? identified : unidentified)[
          m.properties.category
        ] || unknown,
      position: {
        lat: m.geometry.coordinates[1],
        lng: m.geometry.coordinates[0],
      },
      onClick: () => props.onSelect(m.properties.id, 'point'),
    }));

  const polylines = props.paths.features
    .filter(
      (f) =>
        f.geometry.type === 'LineString' &&
        f.properties.code.length &&
        f.geometry.coordinates
    )
    .map((f) => ({
      key: f.properties.code,
      positions: f.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      onClick: () => props.onSelect(f.properties.id, 'path'),
    }));

  console.log(polylines);

  return (
    <section className="modern">
      <Map ref={ref} center={center} zoom={zoom} zoomControl={false}>
        <TileLayer
          attribution='&amp;copy <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
        {markers.map((m) => (
          <Marker {...m} />
        ))}

        {polylines.map((p) => (
          <Polyline {...p} />
        ))}
      </Map>
    </section>
  );
});

export default ModernMap;
