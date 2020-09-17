const MAOKUN_SIZE = {
  coordinates: { lat: -8.326171875, lng: 211.720703125 },
  zoomify: [108401, 4263],
};

const xyToLatlng = ([x, y]) => ({
  lat: (y / MAOKUN_SIZE.zoomify[1]) * MAOKUN_SIZE.coordinates.lat,
  lng: (x / MAOKUN_SIZE.zoomify[0]) * MAOKUN_SIZE.coordinates.lng,
});

export default (input) => {
  if (!Array.isArray(input)) return [];
  if (input.length === 0) return [];

  if (typeof input[0] === 'number') {
    return xyToLatlng(input);
  }

  if (Array.isArray(input[0]) && typeof input[0][0] === 'number') {
    return input.map(xyToLatlng);
  }

  return [];
};
