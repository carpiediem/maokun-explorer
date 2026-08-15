import sameDataLength from './sameDataLength';

test('is true when places and paths are the same length and labelLocations is unchanged', () => {
  const prevProps = { places: [1, 2], paths: [1], labelLocations: false };
  const nextProps = { places: [3, 4], paths: [2], labelLocations: false };

  expect(sameDataLength(prevProps, nextProps)).toBe(true);
});

test('is false when places length differs', () => {
  const prevProps = { places: [1, 2], paths: [1], labelLocations: false };
  const nextProps = { places: [3], paths: [1], labelLocations: false };

  expect(sameDataLength(prevProps, nextProps)).toBe(false);
});

test('is false when paths length differs', () => {
  const prevProps = { places: [1, 2], paths: [1], labelLocations: false };
  const nextProps = { places: [1, 2], paths: [1, 2], labelLocations: false };

  expect(sameDataLength(prevProps, nextProps)).toBe(false);
});

test('is false when labelLocations differs', () => {
  const prevProps = { places: [1, 2], paths: [1], labelLocations: false };
  const nextProps = { places: [1, 2], paths: [1], labelLocations: true };

  expect(sameDataLength(prevProps, nextProps)).toBe(false);
});
