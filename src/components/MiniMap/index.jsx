import React from "react";
import { FormattedMessage } from "react-intl";

import "./MiniMap.css";

const MAOKUN_WIDTH = 108401; // (423 * 256) + 113
const MAOKUN_HEIGHT = 4263; // (16 * 256) + 167

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
  const MARGINS = { top: 10, left: 50, right: 50 };
  const SIZE = {
    width: window.innerWidth - MARGINS.left - MARGINS.right,
    height: 55
  };

  function handleClick(evt) {
    props.onClick({
      xRatio: (evt.nativeEvent.pageX - MARGINS.left) / SIZE.width,
      yRatio: (evt.nativeEvent.pageY - MARGINS.top) / SIZE.height
    });
  }

  return (
    <svg id="mini-map" onClick={handleClick}>
      <g id="jiangsu">
        <rect x="87%" y="0%" width="13%" height="100%"></rect>
      </g>
      <g id="shanghai">
        <rect x="85.5%" y="0%" width="1.5%" height="100%"></rect>
      </g>
      <g id="zhejiang">
        <rect x="72%" y="0%" width="13.5%" height="100%"></rect>
      </g>
      <g id="fujian">
        <rect x="60%" y="0%" width="12%" height="100%"></rect>
      </g>
      <g id="guangdong">
        <rect x="55.25%" y="0%" width="4.75%" height="40%"></rect>
        <rect x="56.25%" y="40%" width="3.75%" height="40%"></rect>
      </g>
      <g id="guangxi">
        <rect x="54.25%" y="0%" width="1%" height="40%"></rect>
      </g>
      <g id="hainan">
        <rect x="54.25%" y="40%" width="2%" height="25%"></rect>
      </g>
      <g id="vietnam">
        <rect x="46%" y="0%" width="8.25%" height="50%"></rect>
        <rect x="48%" y="50%" width="6.25%" height="50%"></rect>
      </g>
      <g id="indonesia">
        <rect x="19.5%" y="50%" width="28.5%" height="50%"></rect>
      </g>
      <g id="khmer">
        <rect x="45.5%" y="0%" width="0.5%" height="50%"></rect>
      </g>
      <g id="thailand">
        <rect x="39.5%" y="0%" width="6%" height="50%"></rect>
        <rect x="23%" y="0%" width="2.5%" height="50%"></rect>
      </g>
      <g id="malaysia">
        <rect x="25.5%" y="0%" width="14%" height="50%"></rect>
      </g>
      <g id="singapore">
        <rect x="33%" y="0%" width="1%" height="10%"></rect>
      </g>
      <g id="myanmar">
        <rect x="17.25%" y="0%" width="5.75%" height="50%"></rect>
      </g>
      <g id="bangladesh">
        <rect x="10%" y="0%" width="7.25%" height="20%"></rect>
        <rect x="15%" y="20%" width="2.25%" height="30%"></rect>
      </g>
      <g id="maldives">
        <rect x="15%" y="50%" width="1%" height="20%"></rect>
      </g>
      <g id="srilanka">
        <rect x="13%" y="20%" width="2%" height="50%"></rect>
      </g>
      <g id="india">
        <rect x="6%" y="0%" width="4%" height="20%"></rect>
        <rect x="6%" y="20%" width="7%" height="30%"></rect>
      </g>
      <g id="pakistan">
        <rect x="3.5%" y="0%" width="2.5%" height="50%"></rect>
      </g>
      <g id="iran">
        <rect x="0%" y="0%" width="2%" height="100%"></rect>
        <rect x="2%" y="0%" width="1.5%" height="50%"></rect>
      </g>
      <g id="oman">
        <rect x="2%" y="50%" width="5.5%" height="50%"></rect>
      </g>
      <g id="yemen">
        <rect x="7.5%" y="60%" width="2.25%" height="40%"></rect>
      </g>
      <g id="somalia">
        <rect x="9.75%" y="70%" width="2.75%" height="30%"></rect>
      </g>
      <g id="eastafrica">
        <rect x="12.5%" y="70%" width="2.5%" height="30%"></rect>
      </g>

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
      <text x="57.625%" y="40%" textAnchor="middle">
        <FormattedMessage id="regions.guangdong" defaultMessage="Guangdong" />
      </text>
      <text x="54.75%" y="16%" textAnchor="middle">
        <FormattedMessage id="regions.guangxi" defaultMessage="Guangxi" />
      </text>
      <text x="55.25%" y="60%" textAnchor="middle">
        <FormattedMessage id="regions.hainan" defaultMessage="Hainan" />
      </text>
      <text x="51%" y="60%" textAnchor="middle">
        <FormattedMessage id="regions.vietnam" defaultMessage="Vietnam" />
      </text>
      <text x="33.75%" y="85%" textAnchor="middle">
        <FormattedMessage id="regions.indonesia" defaultMessage="Indonesia" />
      </text>
      <text x="45.25%" y="20%" textAnchor="middle">
        <FormattedMessage id="regions.khmer" defaultMessage="Cambodia/Laos" />
      </text>
      <text x="42.5%" y="45%" textAnchor="middle">
        <FormattedMessage id="regions.thailand" defaultMessage="Thailand" />
      </text>
      <text x="24.25%" y="20%" textAnchor="middle">
        <FormattedMessage id="regions.thailand" defaultMessage="Thailand" />
      </text>
      <text x="32.5%" y="40%" textAnchor="middle">
        <FormattedMessage id="regions.malaysia" defaultMessage="Malaysia" />
      </text>
      <text x="33.5%" y="16%" textAnchor="middle">
        <FormattedMessage id="regions.singapore" defaultMessage="Singapore" />
      </text>
      <text x="19.75%" y="35%" textAnchor="middle">
        <FormattedMessage id="regions.myanmar" defaultMessage="Myanmar" />
      </text>
      <text x="13.5%" y="16%" textAnchor="middle">
        <FormattedMessage id="regions.bangladesh" defaultMessage="Bangladesh" />
      </text>
      <text x="15.5%" y="70%" textAnchor="middle">
        <FormattedMessage id="regions.maldives" defaultMessage="Maldives" />
      </text>
      <text x="14%" y="50%" textAnchor="middle">
        <FormattedMessage id="regions.srilanka" defaultMessage="Sri Lanka" />
      </text>
      <text x="10%" y="40%" textAnchor="middle">
        <FormattedMessage id="regions.india" defaultMessage="India" />
      </text>
      <text x="4.75%" y="25%" textAnchor="middle">
        <FormattedMessage id="regions.pakistan" defaultMessage="Pakistan" />
      </text>
      <text x="1.5%" y="40%" textAnchor="middle">
        <FormattedMessage id="regions.iran" defaultMessage="Iran" />
      </text>
      <text x="4.65%" y="95%" textAnchor="middle">
        <FormattedMessage id="regions.oman" defaultMessage="Oman" />
      </text>
      <text x="8.625%" y="75%" textAnchor="middle">
        <FormattedMessage id="regions.yemen" defaultMessage="Yemen" />
      </text>
      <text x="11%" y="98%" textAnchor="middle">
        <FormattedMessage id="regions.somalia" defaultMessage="Somalia" />
      </text>
      <text x="13.75%" y="85%" textAnchor="middle">
        <FormattedMessage id="regions.eastafrica" defaultMessage="E. Africa" />
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
