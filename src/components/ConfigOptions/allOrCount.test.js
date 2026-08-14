import allOrCount from './allOrCount';

test('returns "all" when every value is true', () => {
  expect(allOrCount({ a: true, b: true })).toBe('all');
});

test('returns "no" when every value is false', () => {
  expect(allOrCount({ a: false, b: false })).toBe('no');
});

test('returns "all" for an empty object, since every() is vacuously true', () => {
  expect(allOrCount({})).toBe('all');
});

test('returns a count when values are mixed', () => {
  expect(allOrCount({ a: true, b: false, c: true })).toBe('2 of 3');
});

test('defaults to an empty object when called without arguments', () => {
  expect(allOrCount()).toBe('all');
});
