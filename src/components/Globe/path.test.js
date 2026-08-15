import path from './path';

test('generates an SVG path string for a geometry', () => {
  const feature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    },
  };

  expect(path(feature)).toEqual(expect.stringMatching(/^M/));
});
