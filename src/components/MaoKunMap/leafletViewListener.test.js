import leafletViewListener from './leafletViewListener';
import MAOKUN_SIZE from './size';

function fakeTarget({ zoom, southWest, northEast, hasZoomedOutClass = false }) {
  const classList = {
    add: jest.fn(),
    remove: jest.fn(),
  };
  return {
    _zoom: zoom,
    _mapPane: { parentNode: { classList } },
    getBounds: () => ({ _southWest: southWest, _northEast: northEast }),
  };
}

describe('when zoomed out (zoom <= 4)', () => {
  test('adds the zoomed-out class', () => {
    const onViewChange = jest.fn();
    const target = fakeTarget({ zoom: 3, southWest: { lng: 0, lat: 0 }, northEast: { lng: 0, lat: 0 } });

    leafletViewListener(onViewChange)({ target });

    expect(target._mapPane.parentNode.classList.add).toHaveBeenCalledWith('zoomed-out');
    expect(target._mapPane.parentNode.classList.remove).not.toHaveBeenCalled();
  });
});

describe('when zoomed in (zoom > 4)', () => {
  test('removes the zoomed-out class', () => {
    const onViewChange = jest.fn();
    const target = fakeTarget({ zoom: 5, southWest: { lng: 0, lat: 0 }, northEast: { lng: 0, lat: 0 } });

    leafletViewListener(onViewChange)({ target });

    expect(target._mapPane.parentNode.classList.remove).toHaveBeenCalledWith('zoomed-out');
    expect(target._mapPane.parentNode.classList.add).not.toHaveBeenCalled();
  });
});

describe('bounds clamping', () => {
  test('clamps within [0, 1] and reports percentage bounds', () => {
    const onViewChange = jest.fn();
    const target = fakeTarget({
      zoom: 5,
      southWest: { lng: -50, lat: MAOKUN_SIZE.coordinates.lat * 2 },
      northEast: { lng: MAOKUN_SIZE.coordinates.lng * 2, lat: 50 },
    });

    leafletViewListener(onViewChange)({ target });

    expect(onViewChange).toHaveBeenCalledWith({
      _southWest: [0, 1],
      _northEast: [1, 0],
    });
  });

  test('reports proportional bounds within range', () => {
    const onViewChange = jest.fn();
    const target = fakeTarget({
      zoom: 5,
      southWest: { lng: MAOKUN_SIZE.coordinates.lng / 4, lat: MAOKUN_SIZE.coordinates.lat / 4 },
      northEast: { lng: MAOKUN_SIZE.coordinates.lng / 2, lat: MAOKUN_SIZE.coordinates.lat / 2 },
    });

    leafletViewListener(onViewChange)({ target });

    expect(onViewChange).toHaveBeenCalledWith({
      _southWest: [0.25, 0.25],
      _northEast: [0.5, 0.5],
    });
  });
});
