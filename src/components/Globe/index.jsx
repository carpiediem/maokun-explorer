import React, { useEffect } from 'react';
import { geoOrthographic, geoPath } from 'd3-geo';

import drawGlobe from './drawGlobe';
import drawGraticule from './drawGraticule';

const KOZHIKODE = [-75.75, -11.25];
const projection = geoOrthographic().rotate(KOZHIKODE);
const path = geoPath().projection(projection);

export function drawFov({ _southWest, _northEast }) {
  const projected = [
    [_southWest.lng, _southWest.lat],
    [_southWest.lng, _northEast.lat],
    [_northEast.lng, _northEast.lat],
    [_northEast.lng, _southWest.lat],
    [_southWest.lng, _southWest.lat],
  ].map(projection);

  return `M ${projected.join(' ')}`;
}

export default function Globe(props) {
  useEffect(() => {
    drawGraticule(path);
    drawGlobe(path);
  });

  return (
    <svg
      id="globe"
      width="120"
      height="120"
      viewBox="330 0 300 500"
      style={{ position: 'absolute', bottom: 5, left: 5, zIndex: 1000 }}
    >
      <g className="graticule"></g>
      <g className="countries"></g>
      <path
        className="field-of-view"
        ref={props.fovRef}
        fill="none"
        stroke="red"
        strokeWidth="2px"
      />
    </svg>
  );
}
