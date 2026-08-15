jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
  createWriteStream: jest.fn(),
  unlinkSync: jest.fn(),
}));
jest.mock('node-fetch', () => jest.fn());
jest.mock('gm', () => jest.fn());
jest.mock('cli-progress', () => ({
  SingleBar: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    setTotal: jest.fn(),
    update: jest.fn(),
    stop: jest.fn(),
  })),
  Presets: { shades_classic: {} },
}));

const { PassThrough } = require('stream');
const fs = require('fs');
const fetch = require('node-fetch');
const gm = require('gm');

function autoEndingBody() {
  const body = new PassThrough();
  process.nextTick(() => body.end('data'));
  return body;
}

function mockFsAndFetch({ existsSyncReturns = false } = {}) {
  fs.existsSync.mockReturnValue(existsSyncReturns);
  fs.mkdirSync.mockImplementation(() => {});
  fs.unlinkSync.mockImplementation(() => {});
  fs.readdirSync.mockReturnValue([]);
  fs.createWriteStream.mockImplementation(() => new PassThrough());
  fetch.mockImplementation(() => Promise.resolve({ body: autoEndingBody() }));
}

// A hard cap on gm().size() calls: guarantees every test terminates even if a test's
// path -> size mapping doesn't cover every tile the algorithm ends up requesting.
function mockGmSizes(sizesByPath) {
  let calls = 0;
  gm.mockImplementation((path) => ({
    size: (cb) => {
      calls += 1;
      if (calls > 30) {
        cb(new Error(`Safety cap hit; unexpected tile requested: ${path}`));
        return;
      }
      const outcome = sizesByPath(path);
      if (outcome instanceof Error) cb(outcome);
      else cb(null, outcome);
    },
  }));
}

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
});

test('creates the directory and its first tile group when they do not exist', async () => {
  mockFsAndFetch({ existsSyncReturns: false });
  mockGmSizes((path) => (path.endsWith('0-0-0.jpg') ? { width: 100, height: 100 } : new Error('stop immediately')));

  const zoomifyDownload = require('./zoomify-download');
  await zoomifyDownload('https://example.com/', './tiles');

  expect(fs.mkdirSync).toHaveBeenCalledWith('./tiles');
  expect(fs.mkdirSync).toHaveBeenCalledWith('./tiles/TileGroup0');
});

test('does not recreate the directory or first tile group when they already exist', async () => {
  mockFsAndFetch({ existsSyncReturns: true });
  mockGmSizes((path) => (path.endsWith('0-0-0.jpg') ? { width: 100, height: 100 } : new Error('stop immediately')));

  const zoomifyDownload = require('./zoomify-download');
  await zoomifyDownload('https://example.com/', './tiles');

  expect(fs.mkdirSync).not.toHaveBeenCalled();
});

test('accepts custom opts instead of the defaults, and strips a trailing slash from the base URL', async () => {
  mockFsAndFetch({ existsSyncReturns: true });
  mockGmSizes((path) => (path.endsWith('0-0-0.jpg') ? { width: 100, height: 100 } : new Error('stop immediately')));

  const zoomifyDownload = require('./zoomify-download');
  await zoomifyDownload('https://example.com/', './tiles', {
    tileGroupPrefix: 'Group',
    tilesPerTileGroup: 4,
    tileSize: 128,
  });

  expect(fetch).toHaveBeenCalledWith('https://example.com/Group0/0-0-0.jpg');
});

test('downloads a small pyramid, shrinking tiles until the whole download completes at a (0,0) failure', async () => {
  mockFsAndFetch({ existsSyncReturns: false });
  mockGmSizes((path) => {
    if (path.endsWith('0-0-0.jpg')) return { width: 100, height: 100 }; // aspectRatio 1 ("wide" branch)
    if (path.endsWith('1-0-0.jpg')) return { width: 300, height: 300 }; // large: keep going
    if (path.endsWith('1-1-0.jpg')) return { width: 50, height: 50 }; // small: ends this zoom level
    return new Error('404'); // ends the whole download (zoom 2, tile 0,0)
  });

  const zoomifyDownload = require('./zoomify-download');
  await zoomifyDownload('https://example.com/', './tiles', { tilesPerTileGroup: 1 });

  expect(console.log).toHaveBeenCalledWith('Download complete');
});

test('skips grid positions the aspect ratio excludes from the image', async () => {
  mockFsAndFetch({ existsSyncReturns: false });
  mockGmSizes((path) => {
    if (path.endsWith('0-0-0.jpg')) return { width: 100, height: 30 }; // aspectRatio 0.3 ("wide" branch)
    // At zoom 1 (a 2x2 grid), row v=1 is entirely excluded (1/2 = 0.5 is not < 0.3), so only
    // v=0's two tiles (h=0 and h=1) are ever requested.
    if (path.endsWith('1-0-0.jpg')) return { width: 300, height: 300 };
    if (path.endsWith('1-1-0.jpg')) return { width: 300, height: 300 };
    return new Error('404'); // ends the whole download (zoom 2, tile 0,0)
  });

  const zoomifyDownload = require('./zoomify-download');
  await zoomifyDownload('https://example.com/', './tiles');

  expect(console.log).toHaveBeenCalledWith('Download complete');
});

test('rejects the whole download when a non-(0,0) tile fails to fetch its size', async () => {
  mockFsAndFetch({ existsSyncReturns: false });
  mockGmSizes((path) => {
    if (path.endsWith('0-0-0.jpg')) return { width: 300, height: 100 }; // aspectRatio 3 ("tall" branch)
    if (path.endsWith('1-0-0.jpg')) return { width: 300, height: 300 }; // large: keep going
    return new Error('404'); // fails on a non-(0,0) tile (1-1-0.jpg)
  });

  const zoomifyDownload = require('./zoomify-download');

  await expect(zoomifyDownload('https://example.com/', './tiles')).rejects.toThrow('404');
});
