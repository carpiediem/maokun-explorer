import MAOKUN_SIZE from './size';

export default (onViewChange) => ({ target }) => {
  if (target._zoom <= 4) target._mapPane.parentNode.classList.add('zoomed-out');
  else target._mapPane.parentNode.classList.remove('zoomed-out');

  const { _northEast, _southWest } = target.getBounds();
  const percentBounds = {
    _southWest: [
      Math.max(0, _southWest.lng / MAOKUN_SIZE.coordinates.lng),
      Math.min(1, _southWest.lat / MAOKUN_SIZE.coordinates.lat),
    ],
    _northEast: [
      Math.min(1, _northEast.lng / MAOKUN_SIZE.coordinates.lng),
      Math.max(0, _northEast.lat / MAOKUN_SIZE.coordinates.lat),
    ],
  };

  onViewChange(percentBounds);
};
