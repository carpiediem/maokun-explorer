import xyToLeaflet, { latlngToXy } from './xyToLeaflet';
import MAOKUN_SIZE from './size.json';

describe('when input is not an array', () => {
  test('returns an empty array', () => {
    expect(xyToLeaflet({ x: 1, y: 2 })).toEqual([]);
  });
});

describe('when input is an empty array', () => {
  test('returns an empty array', () => {
    expect(xyToLeaflet([])).toEqual([]);
  });
});

describe('when input is a single [x, y] point', () => {
  test('converts to a lat/lng object', () => {
    expect(xyToLeaflet([MAOKUN_SIZE.zoomify[0] / 2, MAOKUN_SIZE.zoomify[1] / 2])).toEqual({
      lat: MAOKUN_SIZE.coordinates.lat / 2,
      lng: MAOKUN_SIZE.coordinates.lng / 2,
    });
  });

  describe('and a margin is given', () => {
    test('returns a bounding box padded by the margin', () => {
      const [x, y] = [1000, 1000];
      const margin = 100;

      expect(xyToLeaflet([x, y], margin)).toEqual([
        {
          lat: ((y - margin) / MAOKUN_SIZE.zoomify[1]) * MAOKUN_SIZE.coordinates.lat,
          lng: ((x - margin) / MAOKUN_SIZE.zoomify[0]) * MAOKUN_SIZE.coordinates.lng,
        },
        {
          lat: ((y + margin) / MAOKUN_SIZE.zoomify[1]) * MAOKUN_SIZE.coordinates.lat,
          lng: ((x + margin) / MAOKUN_SIZE.zoomify[0]) * MAOKUN_SIZE.coordinates.lng,
        },
      ]);
    });
  });
});

describe('when input is an array of [x, y] points', () => {
  test('converts each point to a lat/lng object', () => {
    const points = [
      [0, 0],
      [MAOKUN_SIZE.zoomify[0], MAOKUN_SIZE.zoomify[1]],
    ];

    expect(xyToLeaflet(points)).toEqual([
      { lat: -0, lng: 0 },
      { lat: MAOKUN_SIZE.coordinates.lat, lng: MAOKUN_SIZE.coordinates.lng },
    ]);
  });
});

describe('when input is an array of neither numbers nor points', () => {
  test('returns an empty array', () => {
    expect(xyToLeaflet([{ x: 1, y: 2 }])).toEqual([]);
  });
});

describe('latlngToXy', () => {
  test('converts a lat/lng object back to x/y', () => {
    expect(latlngToXy({ lat: MAOKUN_SIZE.coordinates.lat, lng: MAOKUN_SIZE.coordinates.lng })).toEqual([
      MAOKUN_SIZE.zoomify[0],
      MAOKUN_SIZE.zoomify[1],
    ]);
  });
});
