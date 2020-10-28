import MAOKUN_SIZE from './size';
export default function getPercentageBounds(mapRef) {
  const { _northEast, _southWest } = mapRef.current.leafletElement.getBounds();
  const hRatio = MAOKUN_SIZE.zoomify[0] / MAOKUN_SIZE.coordinates.lng;
  const vRatio = MAOKUN_SIZE.zoomify[1] / MAOKUN_SIZE.coordinates.lat;

  return {
    _southWest: [_southWest.lng * hRatio, _southWest.lat * vRatio],
    _northEast: [_northEast.lng * hRatio, _northEast.lat * vRatio],
  };
}
