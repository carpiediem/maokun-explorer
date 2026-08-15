import centerOn from './centerOn';

describe('when the map ref is not yet attached', () => {
  test('does nothing', () => {
    expect(() => centerOn({ current: null })).not.toThrow();
  });
});

describe('when center is not an array', () => {
  test('does nothing', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, { lat: 1, lng: 2 });
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

function boundsCloseTo(bounds, expected) {
  bounds.forEach((point, i) => {
    expect(point.lng).toBeCloseTo(expected[i].lng);
    expect(point.lat).toBeCloseTo(expected[i].lat);
  });
}

describe('when center is a single [lng, lat] point', () => {
  test('flies to a bounding box around the point, padded by the margin', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, [118.8127, 32.0426], 0.1);

    const [bounds, options] = mapRef.current.leafletElement.flyToBounds.mock.calls[0];
    boundsCloseTo(bounds, [
      { lng: 118.7127, lat: 31.9426 },
      { lng: 118.9127, lat: 32.1426 },
    ]);
    expect(options).toEqual({ duration: 2 });
  });

  test('defaults to the Ming Palace with a small margin', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef);

    const [bounds, options] = mapRef.current.leafletElement.flyToBounds.mock.calls[0];
    boundsCloseTo(bounds, [
      { lng: 118.7527, lat: 31.9826 },
      { lng: 118.8727, lat: 32.1026 },
    ]);
    expect(options).toEqual({ duration: 2 });
  });
});

describe('when center is an array of neither numbers nor points', () => {
  test('does nothing', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, [{ lat: 1, lng: 2 }]);
    expect(mapRef.current.leafletElement.flyToBounds).not.toHaveBeenCalled();
  });
});

describe('when center is an array of [lng, lat] points', () => {
  test('flies to bounds built from the reversed points', () => {
    const mapRef = { current: { leafletElement: { flyToBounds: jest.fn() } } };
    centerOn(mapRef, [
      [118.8, 32.0],
      [119.0, 32.2],
    ]);

    expect(mapRef.current.leafletElement.flyToBounds).toHaveBeenCalledWith(
      [
        [32.0, 118.8],
        [32.2, 119.0],
      ],
      { duration: 2 },
    );
  });
});
