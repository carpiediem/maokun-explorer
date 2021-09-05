import MAOKUN_SIZE from './size.json';

export default (percentBounds) =>
  ({ geometry }) =>
    geometry.type === 'Point' &&
    geometry.coordinates &&
    geometry.coordinates.length === 2 &&
    geometry.zoomify[0] >= percentBounds._southWest[0] * MAOKUN_SIZE.zoomify[0] &&
    geometry.zoomify[0] <= percentBounds._northEast[0] * MAOKUN_SIZE.zoomify[0] &&
    geometry.zoomify[1] >= percentBounds._northEast[1] * MAOKUN_SIZE.zoomify[1] &&
    geometry.zoomify[1] <= percentBounds._southWest[1] * MAOKUN_SIZE.zoomify[1];
