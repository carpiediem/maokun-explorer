import React from 'react';
import { FormattedMessage } from 'react-intl';

import handleClick from './handleClick';
import regions from './regions.json';
import './MiniMap.css';

function MiniMap({ fovRef, bounds, onClick }) {
  return (
    <svg id="mini-map" onClick={handleClick(onClick)}>
      <g className="colors">
        {regions.map(({ id, rects }) => (
          <g id={id} key={id}>
            {rects.map(({ x, y, width, height }, i) => (
              <rect
                x={`${x}%`}
                y={`${y}%`}
                width={`${width}%`}
                height={`${height}%`}
                key={i}
              ></rect>
            ))}
          </g>
        ))}
      </g>
      <g className="text">
        {regions.map(({ x, y, id, name }) => (
          <text x={`${x}%`} y={`${y}%`} textAnchor="middle" key={id}>
            <FormattedMessage id={`regions.${id}`} defaultMessage={name} />
          </text>
        ))}
      </g>

      <rect
        ref={fovRef}
        id="bounds"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
      ></rect>
    </svg>
  );
}

export default MiniMap;
