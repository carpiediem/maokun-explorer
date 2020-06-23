import React from "react";
import { FormattedMessage } from "react-intl";

import "./MiniMap.css";

const MAOKUN_WIDTH = 108401; // (423 * 256) + 113
const MAOKUN_HEIGHT = 4263; // (16 * 256) + 167

// {
//   "name": "Zhejiang",
//   "left": "72%",
//   "width": "13.5%",
//   "top": 0,
//   "height": "100%"
// },
// {
//   "name": "Fujian",
//   "left": "60%",
//   "width": "12%",
//   "top": 0,
//   "height": "100%"
// },
// {
//   "name": "Guangdong",
//   "left": "55.25%",
//   "width": "4.75%",
//   "top": 0,
//   "height": "80%",
//   "paddingTop": "9px"
// },

function MiniMap(props) {
  const { _southWest, _northEast } = props.bounds;
  const x = Math.max(0, (100 * _southWest[0]) / MAOKUN_WIDTH);
  const y = Math.max(0, (100 * _northEast[1]) / MAOKUN_HEIGHT);
  const bounds = {
    x: `${x}%`,
    y: `${y}%`,
    width: `${Math.min(100, (100 * _northEast[0]) / MAOKUN_WIDTH) - x}%`,
    height: `${Math.min(100, (100 * _southWest[1]) / MAOKUN_HEIGHT) - y}%`
  };

  return (
    <svg id="mini-map">
      <rect id="jiangsu" x="87%" y="0%" width="13%" height="100%"></rect>
      <rect id="shanghai" x="85.5%" y="0%" width="1.5%" height="100%"></rect>
      <rect id="zhejiang" x="72%" y="0%" width="13.5%" height="100%"></rect>
      <rect id="fujian" x="60%" y="0%" width="12%" height="100%"></rect>

      <text x="93.5%" y="60%" textAnchor="middle">
        <FormattedMessage id="regions.jiangsu" defaultMessage="Jiangsu" />
      </text>
      <text x="86.25%" y="90%" textAnchor="middle">
        <FormattedMessage id="regions.shanghai" defaultMessage="Shanghai" />
      </text>
      <text x="78.75%" y="60%" textAnchor="middle">
        <FormattedMessage id="regions.zhejiang" defaultMessage="Zhejiang" />
      </text>
      <text x="66%" y="60%" textAnchor="middle">
        <FormattedMessage id="regions.fujian" defaultMessage="Fujian" />
      </text>

      <rect
        id="bounds"
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
      ></rect>
    </svg>
  );
}

export default MiniMap;
