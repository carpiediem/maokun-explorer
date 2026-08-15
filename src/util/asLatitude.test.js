import asLatitude from './asLatitude';

test('defaults to Polaris when no star is given', () => {
  expect(asLatitude(4)).toBe(asLatitude(4, 'Polaris'));
});

test('computes latitude from Polaris', () => {
  expect(asLatitude(4)).toBe('10.26° N');
});

test('computes latitude from Kochab (case-insensitively)', () => {
  expect(asLatitude(15, 'Kochab')).toBe('37.78° N');
  expect(asLatitude(15, 'KOCHAB')).toBe('37.78° N');
});

test('reports a southern latitude when the result is negative', () => {
  expect(asLatitude(-20, 'Kochab')).toBe('-18.80° S');
});

test('reports a northern latitude when the result is non-negative', () => {
  expect(asLatitude(4, 'Polaris')).toEqual(expect.stringContaining('N'));
});
