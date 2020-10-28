import React from 'react';
import { FormattedMessage } from 'react-intl';

import handleClick from './handleClick';
import regions from './regions.json';
import './MiniMap.css';

function MiniMap({ bounds, onClick }) {
  const { _southWest, _northEast } = bounds;
  const view = {
    x: `${100 * _southWest[0]}%`,
    y: `${100 * _northEast[1]}%`,
    width: `${100 * (_northEast[0] - _southWest[0])}%`,
    height: `${100 * (_southWest[1] - _northEast[1])}%`,
  };

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
        id="bounds"
        x={view.x}
        y={view.y}
        width={view.width}
        height={view.height}
      ></rect>
    </svg>
  );
}

export default MiniMap;
