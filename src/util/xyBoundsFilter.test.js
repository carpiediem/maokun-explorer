import xyBoundsFilter from './xyBoundsFilter';

const XY_BOUNDS = { _southWest: [100, 800], _northEast: [900, 200] };
const inBounds = xyBoundsFilter(XY_BOUNDS);

test('is false for non-Point geometries', () => {
  expect(inBounds({ geometry: { type: 'LineString', coordinates: [[0, 0]] } })).toBe(false);
});

test('is false when coordinates are missing', () => {
  expect(inBounds({ geometry: { type: 'Point', coordinates: null } })).toBeFalsy();
});

test('is false when coordinates is not a [x, y] pair', () => {
  expect(inBounds({ geometry: { type: 'Point', coordinates: [1, 2, 3], zoomify: [500, 500] } })).toBe(false);
});

test('is false when zoomify x is below the visible range', () => {
  expect(inBounds({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [50, 500] } })).toBe(false);
});

test('is false when zoomify x is above the visible range', () => {
  expect(inBounds({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [950, 500] } })).toBe(false);
});

test('is false when zoomify y is below the visible range', () => {
  expect(inBounds({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [500, 100] } })).toBe(false);
});

test('is false when zoomify y is above the visible range', () => {
  expect(inBounds({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [500, 850] } })).toBe(false);
});

test('is true when the point falls within the visible bounds', () => {
  expect(inBounds({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [500, 500] } })).toBe(true);
});
