export default (xyBounds) => (m) =>
  m.geometry.type === 'Point' &&
  m.geometry.coordinates &&
  m.geometry.coordinates.length === 2 &&
  m.geometry.zoomify[0] >= xyBounds._southWest[0] &&
  m.geometry.zoomify[0] <= xyBounds._northEast[0] &&
  m.geometry.zoomify[1] >= xyBounds._northEast[1] &&
  m.geometry.zoomify[1] <= xyBounds._southWest[1];
