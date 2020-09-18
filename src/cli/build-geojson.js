const fetch = require('node-fetch');
const parse = require('csv-parse/lib/sync');
const { writeFileSync } = require('fs');
const {
  POINTS_URL,
  RUTTERS_URL,
  IMAGE_PATH_URL,
  GEO_PATH_URL,
  POINTS_COLUMNS,
  RUTTERS_COLUMNS,
  IMAGE_PATH_COLUMNS,
  GEO_PATH_COLUMNS,
  POINTS_EDITOR,
  PATHS_EDITOR,
  cast,
} = require('./spreadsheet-schema');

const ENCUTF = { encoding: 'UTF-8' };
const getBounds = (agg, { lat, lng }) =>
  !lat
    ? agg
    : [
        Math.min(agg[0], lat),
        Math.min(agg[1], lng),
        Math.max(agg[2], lat),
        Math.max(agg[3], lng),
      ];
const byCode = (agg, { code, x, y, lat, lng }) => {
  if (!x && !y && !lat && !lng) return agg;
  if (!agg[code]) agg[code] = [];
  agg[code].push([x || lng, y || lat]);
  return agg;
};

(async () => {
  // REQUEST DATA FROM GOOGLE SHEETS
  const [pointsCsv, ruttersTsv, imagePathCsv, geoPathCsv] = await Promise.all(
    [
      fetch(POINTS_URL),
      fetch(RUTTERS_URL),
      fetch(IMAGE_PATH_URL),
      fetch(GEO_PATH_URL),
    ].map((p) => p.then((r) => r.text()))
  );

  writeFileSync('public/data/maokun-places.csv', pointsCsv, ENCUTF);
  writeFileSync('public/data/maokun-rutters.csv', ruttersTsv, ENCUTF);
  writeFileSync('public/data/maokun-imagePaths.csv', imagePathCsv, ENCUTF);
  writeFileSync('public/data/maokun-geoPaths.csv', geoPathCsv, ENCUTF);

  //   const pointsCsv = await fetch(POINTS_URL).then((r) => r.text());
  const points = parse(pointsCsv, {
    columns: POINTS_COLUMNS,
    cast,
    skip_empty_lines: true,
    from: 2,
  });
  const pointFeatures = points.map(
    ({ x, y, lat, lng, kamalAngle, ...rest }, index) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        zoomify: [x, y],
        coordinates: lat === '' || !lat ? [] : [lng, lat],
        kamalAngle: kamalAngle === '' ? null : kamalAngle,
      },
      properties: { id: index, ...rest },
    })
  );
  const pointBbox = points.reduce(getBounds, [180, 90, -180, -90]);

  const rutters = parse(ruttersTsv, {
    columns: RUTTERS_COLUMNS,
    cast,
    delimiter: '\t',
    skip_empty_lines: true,
    from: 2,
  });
  const imagePaths = parse(imagePathCsv, {
    columns: IMAGE_PATH_COLUMNS,
    cast,
    skip_empty_lines: true,
    from: 2,
  }).reduce(byCode, {});
  const geoPaths = parse(geoPathCsv, {
    columns: GEO_PATH_COLUMNS,
    cast,
    skip_empty_lines: true,
    from: 2,
  }).reduce(byCode, {});
  const pathFeatures = rutters.map((properties) => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      zoomify: imagePaths[properties.code],
      coordinates: geoPaths[properties.code],
    },
    properties,
  }));

  const pointsCollection = JSON.stringify({
    type: 'FeatureCollection',
    name: 'Places',
    description: 'Every specific place mentioned in the Mao Kun map',
    source: POINTS_EDITOR,
    bbox: pointBbox,
    features: pointFeatures,
  });
  const strictPointsCollection = JSON.stringify({
    type: 'FeatureCollection',
    name: 'Places (strict)',
    description:
      'Places mentioned in the Mao Kun map, excluding those without known geographic coordinates (required for strict geojson validation)',
    source: POINTS_EDITOR,
    bbox: pointBbox,
    features: pointFeatures.filter(
      ({ geometry }) => geometry.coordinates.length === 2
    ),
  });

  const pathsCollection = JSON.stringify({
    type: 'FeatureCollection',
    name: 'Paths',
    description:
      'The path around islands and peninsulas described by sailing directions on the Mao Kun map',
    source: PATHS_EDITOR,
    features: pathFeatures,
  });
  const strictPathsCollection = JSON.stringify({
    type: 'FeatureCollection',
    name: 'Paths (strict)',
    description:
      'The path around islands and peninsulas described by sailing directions on the Mao Kun map (excluding paths without geographic coordinates defined)',
    source: PATHS_EDITOR,
    features: pathFeatures.filter(
      ({ geometry }) => geometry.coordinates && geometry.coordinates.length > 0
    ),
  });

  writeFileSync('public/data/maokun-places.geo.json', pointsCollection, ENCUTF);
  writeFileSync(
    'public/data/maokun-places-strict.geo.json',
    strictPointsCollection,
    ENCUTF
  );
  writeFileSync('public/data/maokun-paths.geo.json', pathsCollection, ENCUTF);
  writeFileSync(
    'public/data/maokun-paths-strict.geo.json',
    strictPathsCollection,
    ENCUTF
  );

  console.log(
    `Saved ${pointFeatures.length} places and ${pathFeatures.length} paths in public/maokun-places.geo.json and maokun-paths.geo.json`
  );
})();
