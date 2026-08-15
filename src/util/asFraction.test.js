import asFraction from './asFraction';

test('renders a quarter fraction', () => {
  expect(asFraction(3.25)).toBe('3¼');
});

test('renders a half fraction', () => {
  expect(asFraction(3.5)).toBe('3½');
});

test('renders a three-quarter fraction', () => {
  expect(asFraction(3.75)).toBe('3¾');
});

test('renders any other value as a plain string', () => {
  expect(asFraction(4)).toBe('4');
  expect(asFraction(4.1)).toBe('4.1');
});
