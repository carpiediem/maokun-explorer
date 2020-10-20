import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Continent from './Continent';
import {
  coastStart,
  hainanStart,
  ceylonStart,
  sumatraStart,
  borneoStart,
  javaStart,
  coastMid,
  hainanMid,
  ceylonMid,
  sumatraMid,
  borneoMid,
  javaMid,
  coastEnd,
  hainanEnd,
  ceylonEnd,
  sumatraEnd,
  borneoEnd,
  javaEnd,
} from './paths';

const useStyles = makeStyles((theme) => ({
  svg: { maxHeight: '40vh' },
  labels: { fontSize: 180, fill: 'white', textTransform: 'uppercase' },
}));

export default function IntroDialog(props) {
  const classes = useStyles();
  // const { locale } = useIntl();

  return (
    <svg
      viewBox="1200 6000 14000 6400"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xlink="http://www.w3.org/1999/xlink"
      className={classes.svg}
    >
      <animate
        id="fade"
        href="#continent"
        attributeName="opacity"
        values="1;0"
        dur="3s"
        fill="freeze"
      />
      <animate
        id="warploop-coastline"
        href="#coastline"
        attributeName="d"
        values={`${coastStart};${coastStart};${coastMid};${coastEnd};${coastEnd};${coastMid};${coastStart}`}
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-borneo"
        href="#borneo"
        attributeName="d"
        values={`${borneoStart};${borneoStart};${borneoMid};${borneoEnd};${borneoEnd};${borneoMid};${borneoStart}`}
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-java"
        href="#java"
        attributeName="d"
        values={`${javaStart};${javaStart};${javaMid};${javaEnd};${javaEnd};${javaMid};${javaStart}`}
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-sumatra"
        href="#sumatra"
        attributeName="d"
        values={`${sumatraStart};${sumatraStart};${sumatraMid};${sumatraEnd};${sumatraEnd};${sumatraMid};${sumatraStart}`}
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-ceylon"
        href="#ceylon"
        attributeName="d"
        values={`${ceylonStart};${ceylonStart};${ceylonMid};${ceylonEnd};${ceylonEnd};${ceylonMid};${ceylonStart}`}
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-hainan-island"
        href="#hainan-island"
        attributeName="d"
        values={`${hainanStart};${hainanStart};${hainanMid};${hainanEnd};${hainanEnd};${hainanMid};${hainanStart}`}
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />

      <animate
        id="warploop-nanjing-x"
        href="#nanjing"
        attributeName="x"
        values="11200;11200;11800;14000;14000;11800;11200"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-nanjing-y"
        href="#nanjing"
        attributeName="y"
        values="7500;7500;6900;8400;8400;6900;7500"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-quinhon-x"
        href="#quinhon"
        attributeName="x"
        values="11800;11800;10800;8500;8500;10800;11800"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-quinhon-y"
        href="#quinhon"
        attributeName="y"
        values="9400;9400;9400;8300;8300;9400;9400"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-kozhikode-x"
        href="#kozhikode"
        attributeName="x"
        values="7800;7800;7800;2800;2800;7800;7800"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-kozhikode-y"
        href="#kozhikode"
        attributeName="y"
        values="9800;9800;9800;8550;8550;9800;9800"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      {/* @4700,7525? 
      <animateTransform
        id="warploop-kozhikode-transform"
        href="#kozhikode"
        attributeName="transform"
        type="rotate"
        values="0 0 0;0 0 0;0 0 0;15 0 0;15 0 0;0 0 0;"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      /> */}
      <animate
        id="warploop-hormuz-x"
        href="#hormuz"
        attributeName="x"
        values="5900;5900;5900;1500;1500;5900;5900"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-hormuz-y"
        href="#hormuz"
        attributeName="y"
        values="7400;7400;7400;9200;9200;7400;7400"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-malindi-x"
        href="#malindi"
        attributeName="x"
        values="2900;2900;3400;3600;3600;3400;2900"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />
      <animate
        id="warploop-malindi-y"
        href="#malindi"
        attributeName="y"
        values="10000;10000;10200;9500;9500;10200;10000"
        dur="6s"
        begin="2s"
        repeatCount="indefinite"
      />

      <Continent />
      <g id="paths" stroke="yellow" fill="none" strokeWidth="40">
        <path id="coastline" d={coastStart} />
        <path id="hainan-island" d={hainanStart} />
        <path id="ceylon" d={ceylonStart} />
        <path id="sumatra" d={sumatraStart} />
        <path id="borneo" d={borneoStart} />
        <path id="java" d={javaStart} />
      </g>
      <g id="labels" fill="yellow" className={classes.labels}>
        <text id="nanjing" x="11200" y="7500">
          Nanjing
        </text>
        <text id="quinhon" x="11800" y="9400" textAnchor="end">
          Qui Nhơn
        </text>
        <text id="kozhikode" x="7800" y="9800" textAnchor="middle">
          Kozhikode
        </text>
        <text id="hormuz" x="5900" y="7400">
          Hormuz
        </text>
        <text id="malindi" x="2900" y="10000" textAnchor="end">
          Malindi
        </text>
      </g>
    </svg>
  );
}
