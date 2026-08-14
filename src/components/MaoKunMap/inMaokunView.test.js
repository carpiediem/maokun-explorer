import inMaokunView from './inMaokunView';
import MAOKUN_SIZE from './size.json';

const PERCENT_BOUNDS = { _southWest: [0.2, 0.8], _northEast: [0.8, 0.2] };
const inView = inMaokunView(PERCENT_BOUNDS);

const X_MIN = 0.2 * MAOKUN_SIZE.zoomify[0];
const X_MAX = 0.8 * MAOKUN_SIZE.zoomify[0];
const Y_MIN = 0.2 * MAOKUN_SIZE.zoomify[1];
const Y_MAX = 0.8 * MAOKUN_SIZE.zoomify[1];
const X_MID = (X_MIN + X_MAX) / 2;
const Y_MID = (Y_MIN + Y_MAX) / 2;

test('is false for non-Point geometries', () => {
  expect(inView({ geometry: { type: 'LineString', coordinates: [[0, 0]] } })).toBeFalsy();
});

test('is false when coordinates are missing', () => {
  expect(inView({ geometry: { type: 'Point', coordinates: null } })).toBeFalsy();
});

test('is false when coordinates is not a [x, y] pair', () => {
  expect(inView({ geometry: { type: 'Point', coordinates: [1, 2, 3], zoomify: [X_MID, Y_MID] } })).toBeFalsy();
});

test('is false when zoomify x is below the visible range', () => {
  expect(inView({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [X_MIN - 1, Y_MID] } })).toBe(false);
});

test('is false when zoomify x is above the visible range', () => {
  expect(inView({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [X_MAX + 1, Y_MID] } })).toBe(false);
});

test('is false when zoomify y is below the visible range', () => {
  expect(inView({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [X_MID, Y_MIN - 1] } })).toBe(false);
});

test('is false when zoomify y is above the visible range', () => {
  expect(inView({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [X_MID, Y_MAX + 1] } })).toBe(false);
});

test('is true when the point falls within the visible bounds', () => {
  expect(inView({ geometry: { type: 'Point', coordinates: [0, 0], zoomify: [X_MID, Y_MID] } })).toBe(true);
});
