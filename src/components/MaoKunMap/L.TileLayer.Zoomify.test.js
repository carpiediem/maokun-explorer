import { point } from 'leaflet';

import { TileLayerZoomify } from './L.TileLayer.Zoomify';

function buildLayer(dimensions = {}) {
  const unproject = jest.fn(([x, y]) => ({ lat: -y, lng: x }));
  const layer = new TileLayerZoomify('https://example.com/', {
    leaflet: { map: { unproject } },
    tileSize: 256,
    ...dimensions,
  });
  return { layer, unproject };
}

describe('initialize', () => {
  test('throws when width or height are not provided', () => {
    expect(() => buildLayer()).toThrow('The user must set the Width and Height of the Zoomify image');
  });

  test('builds a zoom pyramid, finest level last, and registers layer bounds from the map projection', () => {
    const { layer, unproject } = buildLayer({ width: 300, height: 300, tileSize: 256 });

    // 300x300 needs one halving step (150x150) to fit under the 256 tile size, so two pyramid levels.
    expect(layer._imageSize.map((p) => [p.x, p.y])).toEqual([
      [150, 150],
      [300, 300],
    ]);
    expect(layer._gridSize.map((p) => [p.x, p.y])).toEqual([
      [1, 1],
      [2, 2],
    ]);
    expect(layer.options.maxNativeZoom).toBe(1);
    expect(unproject).toHaveBeenCalled();
    expect(layer.options.bounds.getNorthEast()).toBeTruthy();
  });
});

describe('getTileUrl / _getTileGroup', () => {
  test('templates the url with the tile group, zoom, x, and y', () => {
    const { layer } = buildLayer({ width: 300, height: 300, tileSize: 256 });
    layer._tileZoom = 1;

    expect(layer.getTileUrl({ x: 0, y: 0, z: 1 })).toBe('https://example.com/TileGroup0/1-0-0.jpg');
  });

  test('accumulates tile counts from lower zoom levels into the tile group number', () => {
    const { layer } = buildLayer({ width: 300, height: 300, tileSize: 256 });
    layer._tileZoom = 1;

    // Level 0 has a 1x1 grid (1 tile); at level 1, tile (1,1) is the 1 + (1*2 + 1) = 4th tile (index 3).
    expect(layer.getTileUrl({ x: 1, y: 1, z: 1 })).toBe('https://example.com/TileGroup0/1-1-1.jpg');
  });
});

describe('_addTile', () => {
  function addTile({ width, height, tileSize = 256, coords }) {
    const { layer } = buildLayer({ width, height, tileSize });
    layer._tileZoom = layer.options.maxNativeZoom;
    layer._tiles = {};
    layer._level = { origin: point(0, 0) };
    layer.fire = jest.fn();

    const container = document.createElement('div');
    const tileCoords = point(coords.x, coords.y);
    tileCoords.z = layer._tileZoom;
    layer._addTile(tileCoords, container);

    const key = layer._tileCoordsToKey(tileCoords);
    return layer._tiles[key].el;
  }

  test('shrinks the last row/column of tiles when the image size leaves a remainder', () => {
    // 300x300 at the finest (300x300) level, tileSize 256: grid is 2x2, and 300 % 256 = 44 != 0,
    // so the border tile at (1,1) is smaller than a full tile in both dimensions.
    const tile = addTile({ width: 300, height: 300, tileSize: 256, coords: { x: 1, y: 1 } });

    // A full tile would be 256px; the border tile is scaled down to the leftover 300 % 256 = 44px.
    expect(tile.style.width).not.toBe('256px');
    expect(tile.style.height).not.toBe('256px');
  });

  test('does not resize tiles when the image size divides evenly into tiles', () => {
    // 512x512 with tileSize 256 divides evenly (512 % 256 = 0), so no border tile needs resizing.
    const tile = addTile({ width: 512, height: 512, tileSize: 256, coords: { x: 1, y: 1 } });

    // _initTile always sets a full-tile size up front; only the border-tile branch overrides it.
    expect(tile.style.width).toBe('256px');
    expect(tile.style.height).toBe('256px');
  });
});
