import MAOKUN_SIZE from './size';

const MING_PALACE = [105513, 1863];
const xyToLatlng = ([x, y]) => ({
  lat: (y / MAOKUN_SIZE.zoomify[1]) * MAOKUN_SIZE.coordinates.lat,
  lng: (x / MAOKUN_SIZE.zoomify[0]) * MAOKUN_SIZE.coordinates.lng,
});

export default (mapRef, center = MING_PALACE, margin = 800) => {
  if (!mapRef.current) return;
  if (!Array.isArray(center)) return;
  if (center.length === 0) return;

  if (typeof center[0] === 'number') {
    const leafletBounds = [
      xyToLatlng([center[0] - margin, center[1] - margin]),
      xyToLatlng([center[0] + margin, center[1] + margin]),
    ];

    mapRef.current.leafletElement.flyToBounds(leafletBounds, { duration: 2 });
    return;
  }

  if (Array.isArray(center[0]) && typeof center[0][0] === 'number') {
    mapRef.current.leafletElement.flyToBounds(center.map(xyToLatlng), {
      duration: 2,
    });
  }
};
