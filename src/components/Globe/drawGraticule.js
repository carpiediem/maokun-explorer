import { select } from 'd3-selection';
import { geoGraticule } from 'd3-geo';

import path from './path';

export default function drawGraticule() {
  const g = select('svg#globe g.graticule');
  const graticule = geoGraticule().step([10, 10]);

  g.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path)
    .style('fill', '#fff')
    .style('stroke', '#ccc');
}
