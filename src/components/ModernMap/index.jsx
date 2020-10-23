/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useContext, useEffect, forwardRef } from 'react';
import {
  Map,
  TileLayer,
  ZoomControl,
  CircleMarker,
  Polyline,
  Tooltip,
} from 'react-leaflet';

import { LocaleContext } from '../../LocaleContext';
import './ModernMap.css';

const ModernMap = forwardRef((props, ref) => {
  const [center] = useState({ lat: 32.039579, lng: 118.8 });
  const [locale] = useContext(LocaleContext);

  useEffect(() => {
    ref.current.leafletElement.on('click', (event) => {
      console.log(event);
      if (/leaflet-container/.test(event.originalEvent.path[0].className))
        props.onClick();
    });
  }, []);

  const markers = props.places
    .filter((m) => m.geometry.type === 'Point' && m.geometry.coordinates.length)
    .map((m, i) => ({
      key: m.properties.id,
      name: locale === 'en' ? m.properties.nameEn : m.properties.nameTc,
      center: {
        lat: m.geometry.coordinates[1],
        lng: m.geometry.coordinates[0],
      },
      radius: props.selected.point === m.properties.id ? 20 : 5,
      onClick: () => props.onSelect(m.properties.id, 'point', 'modern'),
      className: `circle-marker ${m.properties.category} id-${m.properties.id}`,
      category: m.properties.category,
    }));

  const polylines = props.paths
    .filter(
      (f) =>
        f.geometry.type === 'LineString' &&
        f.properties.code.length &&
        f.geometry.coordinates
    )
    .map((f) => ({
      key: f.properties.code,
      positions: f.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      onClick: () => props.onSelect(f.properties.code, 'path', 'modern'),
      className: `path ${f.properties.direction} code-${f.properties.code}`,
    }));

  return (
    <section className="modern">
      <Map ref={ref} center={center} zoom={13} zoomControl={false}>
        <TileLayer
          attribution='&amp;copy <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
        {markers.map((m) => (
          <CircleMarker {...m}>
            {props.labelLocations && (
              <Tooltip
                direction="bottom"
                offset={[0, -5]}
                opacity={1}
                permanent
                className={m.category}
              >
                {m.name}
              </Tooltip>
            )}
          </CircleMarker>
        ))}

        {polylines.map((p) => (
          <Polyline {...p} />
        ))}
      </Map>
    </section>
  );
});

export default ModernMap;
