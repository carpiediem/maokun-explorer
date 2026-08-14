import centerOn from './centerOn';
import MAOKUN_SIZE from './size';

function boundsCloseTo(bounds, expected) {
  bounds.forEach((point, i) => {
    expect(point.lng).toBeCloseTo(expected[i].lng);
    expect(point.lat).toBeCloseTo(expected[i].lat);
  });
}

describe('when the map ref is not yet attached', () => {
  test('does nothing', () => {
    expect(() => centerOn({ current: null })).not.toThrow();
  });
});

describe('when center is not an array', () => {
  test('does nothing', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, { x: 1, y: 2 });
    expect(mapRef.current.leafletElement.flyToBounds).not.toHaveBeenCalled();
  });
});

describe('when center is an empty array', () => {
  test('does nothing', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, []);
    expect(mapRef.current.leafletElement.flyToBounds).not.toHaveBeenCalled();
  });
});

describe('when center is a single [x, y] point', () => {
  test('flies to a bounding box around the point, padded by the margin', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, [1000, 1000], 100);

    const [bounds, options] = mapRef.current.leafletElement.flyToBounds.mock.calls[0];
    boundsCloseTo(bounds, [
      {
        lat: (900 / MAOKUN_SIZE.zoomify[1]) * MAOKUN_SIZE.coordinates.lat,
        lng: (900 / MAOKUN_SIZE.zoomify[0]) * MAOKUN_SIZE.coordinates.lng,
      },
      {
        lat: (1100 / MAOKUN_SIZE.zoomify[1]) * MAOKUN_SIZE.coordinates.lat,
        lng: (1100 / MAOKUN_SIZE.zoomify[0]) * MAOKUN_SIZE.coordinates.lng,
      },
    ]);
    expect(options).toEqual({ duration: 2 });
  });

  test('defaults to the Ming Palace with a default margin', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef);

    expect(mapRef.current.leafletElement.flyToBounds).toHaveBeenCalled();
  });
});

describe('when center is an array of neither numbers nor points', () => {
  test('does nothing', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, [{ x: 1, y: 2 }]);
    expect(mapRef.current.leafletElement.flyToBounds).not.toHaveBeenCalled();
  });
});

describe('when center is an array of [x, y] points', () => {
  test('flies to bounds built from each point', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, [
      [0, 0],
      [MAOKUN_SIZE.zoomify[0], MAOKUN_SIZE.zoomify[1]],
    ]);

    expect(mapRef.current.leafletElement.flyToBounds).toHaveBeenCalledWith(
      [
        { lat: -0, lng: 0 },
        { lat: MAOKUN_SIZE.coordinates.lat, lng: MAOKUN_SIZE.coordinates.lng },
      ],
      { duration: 2 },
    );
  });
});
