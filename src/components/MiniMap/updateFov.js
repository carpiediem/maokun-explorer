export default (fovRef, { _northEast, _southWest }) => {
  fovRef.current.setAttribute('x', `${100 * _southWest[0]}%`);
  fovRef.current.setAttribute('y', `${100 * _northEast[1]}%`);
  fovRef.current.setAttribute('width', `${100 * (_northEast[0] - _southWest[0])}%`);
  fovRef.current.setAttribute('height', `${100 * (_southWest[1] - _northEast[1])}%`);
};
