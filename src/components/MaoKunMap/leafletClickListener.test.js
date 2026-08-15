import leafletClickListener from './leafletClickListener';

describe('when onClick is provided', () => {
  test('calls onClick with the latlng', () => {
    const onClick = jest.fn();
    const onSelect = jest.fn();
    const latlng = { lat: 1, lng: 2 };

    leafletClickListener(
      onSelect,
      onClick,
    )({
      originalEvent: { path: [{ className: 'leaflet-container' }] },
      latlng,
    });

    expect(onClick).toHaveBeenCalledWith(latlng);
  });
});

describe('when onClick is not provided', () => {
  test('does not throw', () => {
    const onSelect = jest.fn();

    expect(() =>
      leafletClickListener(
        onSelect,
        undefined,
      )({
        originalEvent: { path: [{ className: 'leaflet-container' }] },
        latlng: { lat: 1, lng: 2 },
      }),
    ).not.toThrow();
  });
});

describe('when onSelect is not provided', () => {
  test('warns and does not throw', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() =>
      leafletClickListener(
        undefined,
        undefined,
      )({
        originalEvent: { path: [{ className: 'leaflet-container' }] },
        latlng: { lat: 1, lng: 2 },
      }),
    ).not.toThrow();

    expect(warnSpy).toHaveBeenCalledWith('onSelect is undefined, when passed to leafletClickListener');
    warnSpy.mockRestore();
  });
});

describe('when the click originates on the leaflet container itself', () => {
  test('calls onSelect(null) to deselect', () => {
    const onSelect = jest.fn();

    leafletClickListener(
      onSelect,
      undefined,
    )({
      originalEvent: { path: [{ className: 'leaflet-container zoomed-out' }] },
      latlng: { lat: 1, lng: 2 },
    });

    expect(onSelect).toHaveBeenCalledWith(null);
  });
});

describe('when the click originates on a child element (e.g. a marker)', () => {
  test('does not call onSelect', () => {
    const onSelect = jest.fn();

    leafletClickListener(
      onSelect,
      undefined,
    )({
      originalEvent: { path: [{ className: 'circle-marker' }] },
      latlng: { lat: 1, lng: 2 },
    });

    expect(onSelect).not.toHaveBeenCalled();
  });
});
