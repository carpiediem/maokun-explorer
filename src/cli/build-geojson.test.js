jest.mock('node-fetch');
jest.mock('fs');

function csvRow(fields) {
  return fields.map((f) => (String(f).includes(',') ? `"${f}"` : f)).join(',');
}

const POINTS_CSV = [
  'label,pinyin,translation,nameTc,nameEn,othersTc,othersEn,otherPossibilities,region,category,kamalNotes,voyages,sourceUrl,wikiEn,wikiZh,locUrl,page,x,y,lat,lng,kamalAngle,extra1,extra2',
  csvRow([
    '古里',
    'Gǔlǐ',
    'Kozhikode',
    '古里',
    'Kozhikode',
    '',
    'Calicut',
    '',
    'India',
    'town',
    '',
    '1,2',
    '',
    '',
    '',
    '',
    '5',
    '100',
    '200',
    '11.25',
    '75.75',
    '4.5',
    '',
    '',
  ]),
  csvRow([
    '忽魯謨斯',
    'Hūlǔmósī',
    'Hormuz',
    '忽魯謨斯',
    'Hormuz',
    '',
    '',
    '',
    'Iran',
    'town',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]),
].join('\n');

const RUTTERS_TSV = [
  [
    'code',
    'name',
    'nameTc',
    'locUrl',
    'direction',
    'landmarks',
    'text',
    'translation',
    'millsTranslation',
    'notes',
    'textHtml',
    'translationHtml',
  ].join('\t'),
  ['wei-1', 'Wei One', '', '', 'in', '古里,Unknown,', 'text', 'translation', '', '', '', ''].join('\t'),
  ['wei-2', 'Wei Two', '', '', 'out', '', 'text', 'translation', '', '', '', ''].join('\t'),
].join('\n');

const IMAGE_PATH_CSV = [
  'code,x,y',
  csvRow(['wei-1', '100', '200']),
  csvRow(['wei-1', '110', '210']),
  csvRow(['wei-2', '', '']),
].join('\n');

const GEO_PATH_CSV = [
  'code,lat,lng,e1,e2,e3,e4,e5,e6,e7,e8,e9,e10',
  csvRow(['wei-1', '11.25', '75.75', '', '', '', '', '', '', '', '', '', '']),
].join('\n');

function respondWith(text) {
  return Promise.resolve({ text: () => Promise.resolve(text) });
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

let writeFileSync;
let consoleLog;
let consoleWarn;

function writtenFile(name) {
  const call = writeFileSync.mock.calls.find(([path]) => path === name);
  return call && call[1];
}

beforeEach(async () => {
  // CRA's jest config resets mocks (including implementations and call history) before every
  // test, and `require('./build-geojson')` triggers a self-executing async IIFE with no export
  // to hook into, so re-run the whole module fresh here and let every test read its output.
  jest.resetModules();

  const fetch = require('node-fetch');
  ({ writeFileSync } = require('fs'));
  fetch.mockImplementation((url) => {
    if (url.includes('gid=16191930')) return respondWith(POINTS_CSV);
    if (url.includes('gid=1045580293')) return respondWith(RUTTERS_TSV);
    if (url.includes('gid=1071465363')) return respondWith(IMAGE_PATH_CSV);
    if (url.includes('gid=1172460950')) return respondWith(GEO_PATH_CSV);
    throw new Error(`Unexpected URL: ${url}`);
  });
  consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  require('./build-geojson');
  // Only one async gap in the module (the initial Promise.all fetch); flush a couple of ticks
  // to let it and its .then() chain settle before assertions run.
  await flushPromises();
  await flushPromises();
});

afterEach(() => {
  consoleLog.mockRestore();
  consoleWarn.mockRestore();
});

test('writes the raw CSV/TSV responses back out', () => {
  expect(writtenFile('public/data/maokun-places.csv')).toBe(POINTS_CSV);
  expect(writtenFile('public/data/maokun-rutters.csv')).toBe(RUTTERS_TSV);
  expect(writtenFile('public/data/maokun-imagePaths.csv')).toBe(IMAGE_PATH_CSV);
  expect(writtenFile('public/data/maokun-geoPaths.csv')).toBe(GEO_PATH_CSV);
});

test('builds a places FeatureCollection with computed ids, voyages, and bounding box', () => {
  const places = JSON.parse(writtenFile('public/data/maokun-places.geo.json'));
  expect(places.type).toBe('FeatureCollection');
  expect(places.features).toHaveLength(2);

  const [first, second] = places.features;
  expect(first.properties.id).toBe(0);
  expect(first.properties.voyages).toEqual([1, 2]);
  expect(first.geometry.coordinates).toEqual([75.75, 11.25]);

  expect(second.properties.id).toBe(1);
  expect(second.properties.voyages).toEqual([]);
  expect(second.geometry.coordinates).toEqual([]);

  expect(places.bbox).toEqual([11.25, 75.75, 11.25, 75.75]);
});

test('excludes places without coordinates from the strict collection', () => {
  const strictPlaces = JSON.parse(writtenFile('public/data/maokun-places-strict.geo.json'));
  expect(strictPlaces.features).toHaveLength(1);
  expect(strictPlaces.features[0].properties.id).toBe(0);
});

test('builds a paths FeatureCollection, resolving landmark labels and warning on unmatched ones', () => {
  const paths = JSON.parse(writtenFile('public/data/maokun-paths.geo.json'));
  expect(paths.features).toHaveLength(2);

  const wei1 = paths.features.find((f) => f.properties.code === 'wei-1');
  expect(wei1.properties.landmarks).toEqual([0, null]);
  expect(wei1.geometry.zoomify).toEqual([
    [100, 200],
    [110, 210],
  ]);
  expect(wei1.geometry.coordinates).toEqual([[75.75, 11.25]]);

  expect(consoleWarn).toHaveBeenCalledWith('Unrecognized landmark: Unknown in wei-1');

  const wei2 = paths.features.find((f) => f.properties.code === 'wei-2');
  expect(wei2.properties.landmarks).toEqual([]);
  expect(wei2.geometry.coordinates).toBeUndefined();
});

test('excludes paths without coordinates from the strict collection', () => {
  const strictPaths = JSON.parse(writtenFile('public/data/maokun-paths-strict.geo.json'));
  expect(strictPaths.features.map((f) => f.properties.code)).toEqual(['wei-1']);
});

test('logs a summary of what was saved', () => {
  expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('Saved 2 places and 2 paths'));
});
