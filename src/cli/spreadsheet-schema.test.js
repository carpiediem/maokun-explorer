const { cast, POINTS_COLUMNS, RUTTERS_COLUMNS, IMAGE_PATH_COLUMNS, GEO_PATH_COLUMNS } = require('./spreadsheet-schema');

describe('cast', () => {
  test('parses "page" as an integer', () => {
    expect(cast('42', { column: 'page' })).toBe(42);
  });

  test.each(['x', 'y', 'lat', 'lng', 'kamalAngle'])('parses "%s" as a float', (column) => {
    expect(cast('4.5', { column })).toBe(4.5);
  });

  test.each(['x', 'y', 'lat', 'lng', 'kamalAngle'])('casts an empty "%s" to null', (column) => {
    expect(cast('', { column })).toBeNull();
  });

  test('splits "landmarks" on commas', () => {
    expect(cast('a,b,c', { column: 'landmarks' })).toEqual(['a', 'b', 'c']);
  });

  test('returns other columns as-is', () => {
    expect(cast('hello', { column: 'label' })).toBe('hello');
  });
});

test('exports the expected column lists', () => {
  expect(POINTS_COLUMNS).toContain('label');
  expect(RUTTERS_COLUMNS).toContain('code');
  expect(IMAGE_PATH_COLUMNS).toEqual(['code', 'x', 'y']);
  expect(GEO_PATH_COLUMNS[0]).toBe('code');
});
