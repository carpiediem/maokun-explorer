import sameDataLength from './sameDataLength';

test('is true when both places and paths are the same length', () => {
  const prevProps = { places: [1, 2], paths: [1] };
  const nextProps = { places: [3, 4], paths: [2] };

  expect(sameDataLength(prevProps, nextProps)).toBe(true);
});

test('is false when places length differs', () => {
  const prevProps = { places: [1, 2], paths: [1] };
  const nextProps = { places: [3], paths: [1] };

  expect(sameDataLength(prevProps, nextProps)).toBe(false);
});

test('is false when paths length differs', () => {
  const prevProps = { places: [1, 2], paths: [1] };
  const nextProps = { places: [1, 2], paths: [1, 2] };

  expect(sameDataLength(prevProps, nextProps)).toBe(false);
});
