jest.mock('fs');
jest.mock('node-fetch');
jest.mock('gm');

const { PassThrough } = require('stream');
const { readdirSync, createWriteStream } = require('fs');
const fetch = require('node-fetch');
const gm = require('gm');
const { auditDirectory, hasTileHere, getSize, download } = require('./zoomify-download');

describe('auditDirectory', () => {
  test('returns a zero state when the directory has no subdirectories', () => {
    readdirSync.mockReturnValueOnce([]);

    expect(auditDirectory('./tiles')).toEqual({ count: 0, zoom: 0, hStart: 0, vStart: 0 });
  });

  test('returns a zero state when the last subdirectory has no files', () => {
    readdirSync.mockReturnValueOnce(['TileGroup0']).mockReturnValueOnce([]);

    expect(auditDirectory('./tiles')).toEqual({ count: 0, zoom: 0, hStart: 0, vStart: 0 });
  });

  test('computes progress from the highest-zoom files in the last subdirectory, ignoring unrecognized files', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});

    readdirSync
      .mockReturnValueOnce(['TileGroup0', 'TileGroup1'])
      .mockReturnValueOnce(['not-a-tile.txt', '1-nonsense.jpg', '1-2-0.jpg', '1-3-1.jpg', '0-0-0.jpg']);

    const result = auditDirectory('./tiles');

    // 1 full group (256) + 5 files in the last group
    expect(result.count).toBe(1 * 256 + 5);
    expect(result.zoom).toBe(1);
    // highest vIndex among zoom-1 files is 1 (from 1-3-1.jpg); '1-nonsense.jpg' starts with the
    // zoom prefix but doesn't end in "-<digits>.<ext>", so it's ignored here too.
    expect(result.vStart).toBe(1);
    // highest hIndex among zoom-1 files at that vStart is 3 (from 1-3-1.jpg)
    expect(result.hStart).toBe(3);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Restarting download from image 1-3-1.jpg'));
    console.log.mockRestore();
  });
});

describe('hasTileHere', () => {
  test('for a tall image (aspectRatio > 1), checks the column against the aspect ratio', () => {
    expect(hasTileHere(2, 1, 0, 0)).toBe(true);
    expect(hasTileHere(2, 1, 5, 0)).toBe(false);
  });

  test('for a wide image (aspectRatio <= 1), checks the row against the aspect ratio', () => {
    expect(hasTileHere(0.5, 1, 0, 0)).toBe(true);
    expect(hasTileHere(0.5, 1, 0, 5)).toBe(false);
  });
});

describe('getSize', () => {
  test('resolves with the image size', async () => {
    gm.mockReturnValue({ size: (cb) => cb(null, { width: 10, height: 20 }) });

    await expect(getSize('some/path.jpg')).resolves.toEqual({ width: 10, height: 20 });
  });

  test('rejects when gm reports an error', async () => {
    const error = new Error('bad image');
    gm.mockReturnValue({ size: (cb) => cb(error) });

    await expect(getSize('some/path.jpg')).rejects.toBe(error);
  });
});

describe('download', () => {
  test('downloads a tile and resolves once the file finishes writing', async () => {
    const body = new PassThrough();
    fetch.mockResolvedValue({ body });
    const fileStream = new PassThrough();
    createWriteStream.mockReturnValue(fileStream);

    const promise = download('https://example.com', './tiles', 'TileGroup0/0-0-0.jpg');
    body.end('fake image data');

    await expect(promise).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith('https://example.com/TileGroup0/0-0-0.jpg');
    expect(createWriteStream).toHaveBeenCalledWith('./tiles/TileGroup0/0-0-0.jpg');
  });

  test('rejects if the response body errors', async () => {
    const body = new PassThrough();
    fetch.mockResolvedValue({ body });
    createWriteStream.mockReturnValue(new PassThrough());

    const promise = download('https://example.com', './tiles', 'TileGroup0/0-0-0.jpg');
    // download() awaits fetch() before wiring up the 'error' listeners; let that settle first.
    await new Promise((r) => setTimeout(r, 0));
    const error = new Error('network error');
    body.emit('error', error);

    await expect(promise).rejects.toBe(error);
  });

  test('rejects if the file stream errors', async () => {
    const body = new PassThrough();
    fetch.mockResolvedValue({ body });
    const fileStream = new PassThrough();
    createWriteStream.mockReturnValue(fileStream);

    const promise = download('https://example.com', './tiles', 'TileGroup0/0-0-0.jpg');
    // download() awaits fetch() before wiring up the 'error' listeners; let that settle first.
    await new Promise((r) => setTimeout(r, 0));
    const error = new Error('disk full');
    fileStream.emit('error', error);

    await expect(promise).rejects.toBe(error);
  });
});
