/* eslint-disable no-loop-func */

const {
  existsSync,
  mkdirSync,
  readdirSync,
  createWriteStream,
  unlinkSync,
} = require('fs');
const fetch = require('node-fetch');
const gm = require('gm');
const cliProgress = require('cli-progress');

// const RE_FILENAME = /(\d+)-(\d+)-(\d+)\.\w+/;
const progress = new cliProgress.SingleBar(
  {
    format:
      'Zoom level {zoom} ({side}x{side}): [{bar}] | {value}/{total} possible tiles | {path}',
  },
  cliProgress.Presets.shades_classic
);

module.exports = async function zoomifyDownload(baseUrl, directory, opts = {}) {
  opts.tileGroupPrefix = opts.tileGroupPrefix || 'TileGroup';
  opts.tilesPerTileGroup = opts.tilesPerTileGroup || 256;
  opts.tileSize = opts.tileSize || 256; // in pixels, width and height
  baseUrl = baseUrl.replace(/\/$/, '');

  console.log(`Downloading tiles from ${baseUrl}`);

  let { count, zoom, hStart, vStart } = auditDirectory(directory);
  let groupIndex = Math.floor(count / opts.tilesPerTileGroup);

  // GET 0-zoom tile
  if (!existsSync(directory)) mkdirSync(directory);
  if (!existsSync(`${directory}/${opts.tileGroupPrefix}0`))
    mkdirSync(`${directory}/${opts.tileGroupPrefix}0`);
  await download(baseUrl, directory, `${opts.tileGroupPrefix}0/0-0-0.jpg`);

  // CHECK ASPECT RATIO
  const size = await getSize(`${directory}/${opts.tileGroupPrefix}0/0-0-0.jpg`);
  const aspectRatio = size && size.height / size.width;

  progress.start(Math.pow(2, zoom) * Math.pow(2, zoom), 0, { zoom });

  let fetchFailed = false;

  for (null; !fetchFailed; zoom++) {
    progress.setTotal(Math.pow(2, zoom) * Math.pow(2, zoom));
    let foundBottom = false;
    for (
      let vIndex = vStart;
      vIndex < Math.pow(2, zoom) && !foundBottom;
      vIndex++
    ) {
      vStart = 0;
      let foundRight = false;
      for (
        let hIndex = hStart;
        hIndex < Math.pow(2, zoom) && !foundRight;
        hIndex++
      ) {
        hStart = 0;
        if (!hasTileHere(aspectRatio, zoom, hIndex, vIndex)) continue;

        const path = `${opts.tileGroupPrefix}${groupIndex}/${zoom}-${hIndex}-${vIndex}.jpg`;

        await download(baseUrl, directory, path);
        const size = await getSize(`${directory}/${path}`).catch((error) => {
          fetchFailed = true;

          if (hIndex === 0 && vIndex === 0) {
            progress.stop();
            console.log('Download complete');
            unlinkSync(`${directory}/${path}`);
            return;
          }

          progress.stop();
          console.log(`Failed to download image from ${baseUrl}/${path}`);
          throw error;
        });
        if (!size || size.width < opts.tileSize) foundRight = true;
        if (!size || size.height < opts.tileSize) foundBottom = true;

        count++;
        const bigIndex = (vIndex + 1) * Math.pow(2, zoom) + hIndex + 1;
        progress.update(bigIndex, { zoom, side: Math.pow(2, zoom), path });

        if (count % opts.tilesPerTileGroup === 1) {
          groupIndex = Math.floor(count / opts.tilesPerTileGroup);
          if (!existsSync(`./tiles/${opts.tileGroupPrefix}${groupIndex}`))
            mkdirSync(`./tiles/${opts.tileGroupPrefix}${groupIndex}`);
        }
      }
    }
  }
  progress.stop();
};

function auditDirectory(directory) {
  // FIND WHICH FILES HAVE ALREADY BEEN DOWNLOADED
  const subdirs = readdirSync(directory);
  if (subdirs.length === 0) return { count: 0, zoom: 0, hIndex: 0, vIndex: 0 };

  const reLastSubdir = new RegExp(`${subdirs.length - 1}$`);
  const lastSubdir = subdirs.find((d) => reLastSubdir.test(d));

  const files = readdirSync(`${directory}/${lastSubdir}`);
  if (files.length === 0) return { count: 0, zoom: 0, hIndex: 0, vIndex: 0 };

  const count = (subdirs.length - 1) * 256 + files.length;
  const zoom = files.reduce((agg, cur) => {
    const zoomMatch = /^(\d+)-/.exec(cur);
    return zoomMatch ? Math.max(agg, parseInt(zoomMatch[1], 10)) : agg;
  }, 0);

  const reHighestZoom = new RegExp(`^${zoom}-`);
  const vStart = files
    .filter((f) => reHighestZoom.test(f))
    .reduce((agg, cur) => {
      const vIndexMatch = /-(\d+)\.\w+$/.exec(cur);
      return vIndexMatch ? Math.max(agg, parseInt(vIndexMatch[1], 10)) : agg;
    }, 0);

  const reLowestRow = new RegExp(`^${zoom}-\\d+-${vStart}\\.\\w+$`);
  const hStart = files
    .filter((f) => reLowestRow.test(f))
    .reduce((agg, cur) => {
      const hIndexMatch = /-(\d+)-\d+\.\w+$/.exec(cur);
      return hIndexMatch ? Math.max(agg, parseInt(hIndexMatch[1], 10)) : agg;
    }, 0);

  console.log(
    `Restarting download from image ${zoom}-${hStart}-${vStart}.jpg (${count} already downloaded)`
  );

  return {
    count,
    zoom,
    hStart,
    vStart,
  };
}

function hasTileHere(aspectRatio, zoom, hIndex, vIndex) {
  if (aspectRatio > 1) {
    // TALL IMAGES
    return hIndex / Math.pow(2, zoom) < aspectRatio;
  } else {
    // WIDE IMAGES
    return vIndex / Math.pow(2, zoom) < aspectRatio;
  }
}

function getSize(path) {
  return new Promise((resolve, reject) =>
    gm(path).size((err, size) => (err ? reject(err) : resolve(size)))
  );
}

async function download(baseUrl, directory, path) {
  const res = await fetch(`${baseUrl}/${path}`);
  return new Promise((resolve, reject) => {
    const fileStream = createWriteStream(`${directory}/${path}`);
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
}
