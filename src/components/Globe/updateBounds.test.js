import updateBounds from './updateBounds';

beforeEach(() => {
  document.body.innerHTML = '<svg id="globe"><path class="field-of-view"></path></svg>';
});

function fieldOfViewPath() {
  return document.querySelector('svg#globe path.field-of-view');
}

test('draws a bounding box from an array of [lat, lng] pairs', () => {
  updateBounds([
    [10, 20],
    [30, 40],
  ]);

  expect(fieldOfViewPath().getAttribute('d')).toEqual(expect.stringMatching(/^M/));
});

test('draws a bounding box from a Leaflet-style bounds object', () => {
  updateBounds({
    _southWest: { lng: 20, lat: 10 },
    _northEast: { lng: 40, lat: 30 },
  });

  expect(fieldOfViewPath().getAttribute('d')).toEqual(expect.stringMatching(/^M/));
});
