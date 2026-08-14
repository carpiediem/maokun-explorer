import { latCalc, latError } from './latitude';

describe('latCalc', () => {
  test('adds the altitude for Polaris (northern circumpolar star)', () => {
    expect(latCalc(4, 'Polaris')).toBe('10.32° N');
  });

  test('subtracts the altitude for other stars, and reports south latitudes', () => {
    expect(latCalc(15, 'Kochab')).toBe('10.76° S');
  });
});

describe('latError', () => {
  test('reports a negative error without a leading sign', () => {
    expect(latError(4, 'Polaris', 11.25)).toBe('-0.93°');
  });

  test('reports a positive error with a leading +', () => {
    expect(latError(4, 'Polaris', 5)).toBe('+5.32°');
  });
});
