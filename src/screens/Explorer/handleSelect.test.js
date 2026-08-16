import handleSelect from './handleSelect';

beforeEach(() => {
  global.gtag = jest.fn();
  document.body.innerHTML = `
    <section class="maokun">
      <path class="circle-marker id-1"></path>
      <path class="circle-marker id-2"></path>
    </section>
    <section class="modern">
      <path class="circle-marker id-1"></path>
      <path class="circle-marker id-2"></path>
    </section>
  `;
});

afterEach(() => {
  delete global.gtag;
  document.body.innerHTML = '';
});

const PLACE = {
  properties: { id: 1 },
  geometry: { coordinates: [10, 20], zoomify: [100, 200] },
};

const PATH = {
  properties: { code: 'wei-1', landmarks: [1, 2] },
  geometry: { coordinates: [], zoomify: [] },
};

function fakeMapRef() {
  return { current: { leafletElement: { flyToBounds: jest.fn() } } };
}

describe('when id is falsy', () => {
  test('resets highlights and selects nothing, without reporting an event', () => {
    document.querySelector('path.circle-marker.id-1').classList.add('selected');
    const setSelected = jest.fn();
    const maokunMapRef = fakeMapRef();
    const modernMapRef = fakeMapRef();

    handleSelect(
      setSelected,
      { current: {} },
      { places: [PLACE], paths: [PATH] },
      maokunMapRef,
      modernMapRef,
    )(null, 'point', 'maokun');

    expect(document.querySelector('path.circle-marker.id-1').classList.contains('selected')).toBe(false);
    expect(setSelected).toHaveBeenCalledWith({ point: null, time: expect.any(Number) });
    expect(global.gtag).not.toHaveBeenCalled();
  });
});

describe('when a selection is made', () => {
  test('updates selectedRef.current synchronously, before flying either map', () => {
    const maokunMapRef = fakeMapRef();
    const modernMapRef = fakeMapRef();
    const selectedRef = { current: {} };
    maokunMapRef.current.leafletElement.flyToBounds.mockImplementation(() => {
      // At the moment the pan begins, the ref must already reflect the new selection so that
      // any view-change handler triggered by this pan can tell it was self-inflicted.
      expect(selectedRef.current).toEqual({ point: 1, time: expect.any(Number) });
    });

    handleSelect(
      jest.fn(),
      selectedRef,
      { places: [PLACE], paths: [PATH] },
      maokunMapRef,
      modernMapRef,
    )(1, 'point', 'modern');

    expect(selectedRef.current).toEqual({ point: 1, time: expect.any(Number) });
    expect(maokunMapRef.current.leafletElement.flyToBounds).toHaveBeenCalled();
  });
});

describe('when a point is selected', () => {
  test('highlights the point marker and reports the selection', () => {
    const setSelected = jest.fn();
    const maokunMapRef = fakeMapRef();
    const modernMapRef = fakeMapRef();

    handleSelect(
      setSelected,
      { current: {} },
      { places: [PLACE], paths: [PATH] },
      maokunMapRef,
      modernMapRef,
    )(1, 'point', 'maokun');

    expect(document.querySelector('section.maokun path.circle-marker.id-1').classList.contains('selected')).toBe(true);
    expect(setSelected).toHaveBeenCalledWith({ point: 1, time: expect.any(Number) });
    expect(global.gtag).toHaveBeenCalledWith(
      'event',
      'place selection',
      expect.objectContaining({ event_label: 'maokun', value: 1 }),
    );
  });

  test('flies the ModernMap to the point when selected from the Mao Kun map', () => {
    const maokunMapRef = fakeMapRef();
    const modernMapRef = fakeMapRef();

    handleSelect(
      jest.fn(),
      { current: {} },
      { places: [PLACE], paths: [PATH] },
      maokunMapRef,
      modernMapRef,
    )(1, 'point', 'maokun');

    expect(modernMapRef.current.leafletElement.flyToBounds).toHaveBeenCalled();
    expect(maokunMapRef.current.leafletElement.flyToBounds).not.toHaveBeenCalled();
  });

  test('flies the MaoKunMap to the point when selected from the modern map', () => {
    const maokunMapRef = fakeMapRef();
    const modernMapRef = fakeMapRef();

    handleSelect(
      jest.fn(),
      { current: {} },
      { places: [PLACE], paths: [PATH] },
      maokunMapRef,
      modernMapRef,
    )(1, 'point', 'modern');

    expect(maokunMapRef.current.leafletElement.flyToBounds).toHaveBeenCalled();
    expect(modernMapRef.current.leafletElement.flyToBounds).not.toHaveBeenCalled();
  });

  test('does not fly either map when the source is unrecognized', () => {
    const maokunMapRef = fakeMapRef();
    const modernMapRef = fakeMapRef();

    handleSelect(
      jest.fn(),
      { current: {} },
      { places: [PLACE], paths: [PATH] },
      maokunMapRef,
      modernMapRef,
    )(1, 'point', 'minimap');

    expect(maokunMapRef.current.leafletElement.flyToBounds).not.toHaveBeenCalled();
    expect(modernMapRef.current.leafletElement.flyToBounds).not.toHaveBeenCalled();
  });
});

describe('when a path is selected', () => {
  test('highlights every landmark on the path and reports the selection', () => {
    const maokunMapRef = fakeMapRef();
    const modernMapRef = fakeMapRef();

    handleSelect(
      jest.fn(),
      { current: {} },
      { places: [PLACE], paths: [PATH] },
      maokunMapRef,
      modernMapRef,
    )('wei-1', 'path', 'maokun');

    document.querySelectorAll('section.maokun path.circle-marker').forEach((marker) => {
      expect(marker.classList.contains('path-landmark')).toBe(true);
    });
    expect(global.gtag).toHaveBeenCalledWith(
      'event',
      'path selection',
      expect.objectContaining({ event_label: 'maokun', value: 'wei-1' }),
    );
  });
});

describe('when the type is unrecognized', () => {
  test('does not highlight anything or throw', () => {
    // Use an id that resolves via the paths lookup (the non-'point' branch), so the feature lookup
    // succeeds and only the type-highlighting switch's default case is actually exercised.
    const maokunMapRef = fakeMapRef();
    const modernMapRef = fakeMapRef();

    expect(() =>
      handleSelect(
        jest.fn(),
        { current: {} },
        { places: [PLACE], paths: [PATH] },
        maokunMapRef,
        modernMapRef,
      )('wei-1', 'other', 'maokun'),
    ).not.toThrow();

    document.querySelectorAll('path.circle-marker').forEach((marker) => {
      expect(marker.classList.contains('path-landmark')).toBe(false);
      expect(marker.classList.contains('selected')).toBe(false);
    });
  });
});
