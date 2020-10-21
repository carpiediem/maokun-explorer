import React, { useEffect } from 'react';

import drawGlobe from './drawGlobe';
import drawGraticule from './drawGraticule';

export default function Globe(props) {
  useEffect(() => {
    drawGraticule();
    drawGlobe();
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
        strokeWidth="5"
      />
    </svg>
  );
}
