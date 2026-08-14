import applyPrefs from './applyPrefs';

function feature(category, voyages) {
  return { properties: { category, voyages } };
}

describe('when the category is not enabled', () => {
  test('excludes the feature', () => {
    const filter = applyPrefs({ town: false }, { none: true });
    expect(filter(feature('town', []))).toBeFalsy();
  });
});

describe('when the category is enabled', () => {
  describe('and the feature has no voyages', () => {
    test('includes the feature when "none" voyages are enabled', () => {
      const filter = applyPrefs({ town: true }, { none: true });
      expect(filter(feature('town', []))).toBe(true);
    });

    test('excludes the feature when "none" voyages are disabled', () => {
      const filter = applyPrefs({ town: true }, { none: false });
      expect(filter(feature('town', []))).toBe(false);
    });
  });

  describe('and the feature has voyages', () => {
    test('includes the feature when at least one voyage is enabled', () => {
      const filter = applyPrefs({ town: true }, { 1: false, 2: true });
      expect(filter(feature('town', [1, 2]))).toBe(true);
    });

    test('excludes the feature when no voyage is enabled', () => {
      const filter = applyPrefs({ town: true }, { 1: false, 2: false });
      expect(filter(feature('town', [1, 2]))).toBe(false);
    });
  });
});
