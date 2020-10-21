// @see https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54

import { select } from 'd3-selection';
import { feature } from 'topojson-client';

const WORLD_GEOJSON = 'data/world-110m.geo.json';

export default async function drawGlobe(path) {
  const g = select('svg#globe g.countries');
  const worldData = await fetch(WORLD_GEOJSON).then((res) => res.json());

  g.selectAll('.segment')
    .data(feature(worldData, worldData.objects.countries).features)
    .enter()
    .append('path')
    .attr('class', 'segment')
    .attr('d', path)
    .style('stroke', '#888')
    .style('stroke-width', '1px')
    .style('fill', (d, i) => '#e5e5e5')
    .style('opacity', '.6');
}
