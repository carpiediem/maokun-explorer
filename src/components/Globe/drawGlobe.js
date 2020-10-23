// @see https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54

import { select } from 'd3-selection';
import { feature } from 'topojson-client';

import path from './path';

const WORLD_TOPOJSON = 'data/world-110m.topo.json';
const CHINA_GEOJSON = 'data/gadm36_CHN_1.geo.json';

export default async function drawGlobe() {
  const [worldData, chinaData] = await Promise.all([
    fetch(WORLD_TOPOJSON).then((res) => res.json()),
    fetch(CHINA_GEOJSON).then((res) => res.json()),
  ]);
  const { features } = feature(worldData, worldData.objects.countries);

  select('svg#globe g.countries')
    .selectAll('.segment')
    .data(features)
    .enter()
    .append('path')
    .attr('class', 'segment')
    .attr('d', path)
    .attr('id', ({ id }) => `country-${id}`)
    .style('stroke', '#888')
    .style('stroke-width', '1px')
    .style('fill', (d, i) => '#e5e5e5')
    .style('opacity', 0.7);

  select('svg#globe g.provinces')
    .selectAll('.segment')
    .data(chinaData.features)
    .enter()
    .append('path')
    .attr('class', 'segment')
    .attr('d', path)
    .attr('id', ({ properties }) => properties.NAME_1)
    .style('fill', 'none');
}
