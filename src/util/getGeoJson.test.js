import getGeoJson from './getGeoJson';

afterEach(() => {
  delete global.fetch;
});

test('fetches the url and resolves with the parsed features', async () => {
  const features = [{ type: 'Feature' }];
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ features }) }));

  await expect(getGeoJson('data/places.geo.json')).resolves.toBe(features);
  expect(global.fetch).toHaveBeenCalledWith('data/places.geo.json');
});
