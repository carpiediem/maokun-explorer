import { feature } from 'topojson-client';

import drawGlobe from './drawGlobe';

jest.mock('topojson-client', () => ({
  feature: jest.fn(),
}));

// Coordinates near the globe's rotation center (see path.js), so they aren't clipped
// by the orthographic projection's back-hemisphere culling.
const GEOMETRY = {
  type: 'LineString',
  coordinates: [
    [75.75, 11.25],
    [76.75, 12.25],
  ],
};

const WORLD_FEATURES = [
  { type: 'Feature', id: 'world-1', geometry: GEOMETRY },
  { type: 'Feature', id: 'world-2', geometry: GEOMETRY },
];
const CHINA_FEATURES = [
  { type: 'Feature', properties: { NAME_1: 'Beijing' }, geometry: GEOMETRY },
  { type: 'Feature', properties: { NAME_1: 'Shanghai' }, geometry: GEOMETRY },
];

beforeEach(() => {
  document.body.innerHTML = '<svg id="globe"><g class="countries"></g><g class="provinces"></g></svg>';

  feature.mockReturnValue({ features: WORLD_FEATURES });

  global.fetch = jest.fn((url) => {
    const body = url === 'data/world-110m.topo.json' ? { objects: { countries: {} } } : { features: CHINA_FEATURES };

    return Promise.resolve({ json: () => Promise.resolve(body) });
  });
});

afterEach(() => {
  delete global.fetch;
});

test('fetches world and China map data', async () => {
  await drawGlobe();

  expect(global.fetch).toHaveBeenCalledWith('data/world-110m.topo.json');
  expect(global.fetch).toHaveBeenCalledWith('data/gadm36_CHN_1.geo.json');
});

test('draws a segment path for each country', async () => {
  await drawGlobe();

  const countryPaths = document.querySelectorAll('svg#globe g.countries path.segment');
  expect(countryPaths.length).toBe(2);
  expect(countryPaths[0].getAttribute('id')).toBe('country-world-1');
  expect(countryPaths[0].getAttribute('d')).toEqual(expect.stringMatching(/^M/));
  expect(countryPaths[0].style.stroke).toBe('#888');
  expect(countryPaths[0].style.strokeWidth).toBe('1px');
  expect(countryPaths[0].style.fill).toBe('#e5e5e5');
  expect(countryPaths[0].style.opacity).toBe('0.7');
});

test('draws a segment path for each Chinese province', async () => {
  await drawGlobe();

  const provincePaths = document.querySelectorAll('svg#globe g.provinces path.segment');
  expect(provincePaths.length).toBe(2);
  expect(provincePaths[0].getAttribute('id')).toBe('Beijing');
  expect(provincePaths[0].getAttribute('d')).toEqual(expect.stringMatching(/^M/));
  expect(provincePaths[0].style.fill).toBe('none');
});
