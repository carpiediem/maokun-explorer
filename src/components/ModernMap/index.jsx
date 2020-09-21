import React, { useState, forwardRef } from 'react';
import {
  Map,
  TileLayer,
  ZoomControl,
  CircleMarker,
  Polyline,
  Tooltip,
} from 'react-leaflet';
// import { identified, selected, unknown } from '../MaoKunMap/icons';

import { LocaleContext } from '../../LocaleContext';
import './ModernMap.css';

const ModernMap = forwardRef((props, ref) => {
  const [center] = useState({ lat: 32.039579, lng: 118.8 });
  // const [zoom] = useState(13);
  const [locale] = React.useContext(LocaleContext);

  const markers = props.places
    .filter((m) => m.geometry.type === 'Point' && m.geometry.coordinates.length)
    .map((m, i) => ({
      key: m.properties.id,
      // ref: props.markerRefs.current[m.properties.id - 1].modern,
      name: locale === 'en' ? m.properties.nameEn : m.properties.nameTc,
      // icon:
      //   (props.selected.point === m.properties.id ? selected : identified)[
      //     m.properties.category
      //   ] || unknown,
      // position: {
      //   lat: m.geometry.coordinates[1],
      //   lng: m.geometry.coordinates[0],
      // },
      center: {
        lat: m.geometry.coordinates[1],
        lng: m.geometry.coordinates[0],
      },
      radius: props.selected.point === m.properties.id ? 20 : 5,
      onClick: () => props.onSelect(m.properties.id, 'point'),
      className: `circle-marker ${m.properties.category} id-${m.properties.id}`,
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
      onClick: () => props.onSelect(f.properties.code, 'path'),
      className: 'path',
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
              <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
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
