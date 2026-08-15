import getPercentageBounds from './getPercentageBounds';
import MAOKUN_SIZE from './size';

test('converts the map bounds (in lat/lng) to zoomify pixel coordinates', () => {
  const mapRef = {
    current: {
      leafletElement: {
        getBounds: () => ({
          _southWest: { lng: 0, lat: MAOKUN_SIZE.coordinates.lat },
          _northEast: { lng: MAOKUN_SIZE.coordinates.lng, lat: 0 },
        }),
      },
    },
  };

  expect(getPercentageBounds(mapRef)).toEqual({
    _southWest: [0, MAOKUN_SIZE.zoomify[1]],
    _northEast: [MAOKUN_SIZE.zoomify[0], -0],
  });
});
