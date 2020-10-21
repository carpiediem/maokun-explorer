import { geoOrthographic, geoPath } from 'd3-geo';

const KOZHIKODE = [-75.75, -11.25];
const projection = geoOrthographic().rotate(KOZHIKODE);
export default geoPath().projection(projection);
