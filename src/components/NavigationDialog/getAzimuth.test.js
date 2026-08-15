import getAzimuth from './getAzimuth';

test('calculates a rising azimuth', () => {
  expect(getAzimuth(29, 15, 18.2, 16.5)).toBe('59º');
});

test('calculates a setting azimuth', () => {
  expect(getAzimuth(29, 15, 18.2, 23.7, true)).toBe('302º');
});

test('defaults to a rising azimuth for 0º declination/latitude', () => {
  expect(getAzimuth()).toBe('90º');
});
