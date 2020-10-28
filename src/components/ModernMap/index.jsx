import React, { forwardRef } from 'react';
import { Map, TileLayer, ZoomControl, Polyline } from 'react-leaflet';

import leafletClickListener from '../MaoKunMap/leafletClickListener';
import toLatLngObject from '../../util/toLatLngObject';
import LabeledMarker from './LabeledMarker';
import './ModernMap.css';

const TILE_SOURCE =
  'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OSM</a>';

const hasKnownLocation = (f) =>
  (f.geometry.type === 'Point' && f.geometry.coordinates[0]) ||
  (f.geometry.type === 'LineString' &&
    f.properties.code.length &&
    f.geometry.coordinates);

const ModernMap = forwardRef((props, ref) => {
  return (
    <section className="modern">
      <Map
        ref={ref}
        center={[11.25, 75.75]}
        zoom={3}
        zoomControl={false}
        onClick={leafletClickListener(props.onClick)}
      >
        <TileLayer
          attribution={TILE_ATTRIBUTION}
          url={TILE_SOURCE}
          prefix={false}
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
        {props.places.filter(hasKnownLocation).map((f) => (
          <LabeledMarker
            key={f.properties.id}
            labeled={props.labelLocations}
            onSelect={props.onSelect}
            {...f}
          />
        ))}

        {props.paths
          .filter(hasKnownLocation)
          .map(({ properties, geometry }) => (
            <Polyline
              key={properties.code}
              positions={geometry.coordinates.map(toLatLngObject)}
              onClick={() => props.onSelect(properties.code, 'path', 'modern')}
              className={`path ${properties.direction} code-${properties.code}`}
            />
          ))}
      </Map>
    </section>
  );
});

export default ModernMap;
