import places from '../../public/data/maokun-places.geo.json';
import placesStrict from '../../public/data/maokun-places-strict.geo.json';
import paths from '../../public/data/maokun-paths.geo.json';
import pathsStrict from '../../public/data/maokun-paths-strict.geo.json';

import CATEGORIES from '../components/ConfigOptions/categories.json';

describe('maokun-places.geo.json', () => {
  test('should be a FeatureCollection', () => {
    expect(places.type).toBe('FeatureCollection');
    expect(places.features).toEqual(expect.any(Array));
    expect(places.features.length).toBeGreaterThan(0);
  });

  test('should include metadata', () => {
    expect(places.name).toEqual(expect.any(String));
    expect(places.name.length).toBeGreaterThan(0);
    expect(places.description).toEqual(expect.any(String));
    expect(places.description.length).toBeGreaterThan(0);
    expect(places.source).toEqual(expect.any(String));
    expect(places.source).toMatch(/^https?:\/\/\w+/);
    expect(places.bbox).toEqual(expect.any(Array));
    expect(places.bbox.length).toBe(4);
    places.bbox.forEach((v) => expect(v).toEqual(expect.any(Number)));
  });

  test('should include Features', () => {
    places.features.forEach((f) => {
      expect(f.type).toBe('Feature');
      expect(f.properties).toEqual(expect.any(Object));
      expect(f.geometry).toEqual(expect.any(Object));

      expect(f.properties.id).toEqual(expect.any(Number));
      expect(f.properties.label).toMatch(/.+/);
      expect(f.properties.pinyin).toMatch(/\w+/);
      expect(f.properties.translation).toMatch(/\w+/);
      expect(f.properties.nameTc).toEqual(expect.any(String));
      expect(f.properties.nameEn).toEqual(expect.any(String));
      expect(f.properties.othersTc).toEqual(expect.any(String));
      expect(f.properties.othersEn).toEqual(expect.any(String));
      expect(f.properties.region).toMatch(/[\w-]+/);
      expect(CATEGORIES).toEqual(
        expect.arrayContaining([f.properties.category])
      );
      expect(f.properties.kamalNotes).toEqual(expect.any(String));
      expect(f.properties.voyages).toEqual(expect.any(Array));
      f.properties.voyages.forEach((i) =>
        expect(i).toEqual(expect.any(Number))
      );
      expect([1, 2, 3, 4, 5, 6, 7]).toEqual(
        expect.arrayContaining(f.properties.voyages)
      );
      expect(f.properties.othersEn).toEqual(expect.any(String));
      expect(f.properties.sourceUrl).toMatch(/^$|^https?:\/\/\w+/);
      expect(f.properties.wikiEn).toMatch(/^$|^https?:\/\/\w+/);
      expect(f.properties.wikiZh).toMatch(/^$|^https?:\/\/\w+/);

      expect(f.geometry.type).toEqual('Point');
      expect(f.geometry.coordinates).toEqual(expect.any(Array));
      if (f.geometry.coordinates.length !== 0)
        expect(f.geometry.coordinates.length).toEqual(2);
      expect(
        f.geometry.coordinates.every((v) => v === null || typeof v === 'number')
      ).toBe(true);
      expect(f.geometry.zoomify).toEqual(expect.any(Array));
      expect(f.geometry.zoomify.length).toEqual(2);
      expect(
        f.geometry.zoomify.every((v) => v === null || typeof v === 'number')
      ).toBe(true);
      if (f.geometry.kamalAngle !== null)
        expect(f.geometry.kamalAngle).toEqual(expect.any(Number));

      // Excluding places not on the map
      if (f.properties.page !== null) {
        expect(f.properties.page).toEqual(expect.any(Number));
        expect(f.properties.locUrl).toMatch(
          /^https:\/\/loc.gov\/resource\/g7821rm\.gct00058\/\?/
        );
      }
    });
  });
});

describe('maokun-places-strict.geo.json', () => {
  test('should be a FeatureCollection', () => {
    expect(placesStrict.type).toBe('FeatureCollection');
    expect(placesStrict.features).toEqual(expect.any(Array));
    expect(placesStrict.features.length).toBeGreaterThan(0);
  });

  test('should include valid Features', () => {
    placesStrict.features.forEach((f) => {
      expect(f.geometry.coordinates).toEqual(expect.any(Array));
      expect(f.geometry.coordinates.length).toEqual(2);
      f.geometry.coordinates.forEach((v) =>
        expect(v).toEqual(expect.any(Number))
      );
    });
  });
});

describe('maokun-paths.geo.json', () => {
  test('should be a FeatureCollection', () => {
    expect(paths.type).toBe('FeatureCollection');
    expect(paths.features).toEqual(expect.any(Array));
    expect(paths.features.length).toBeGreaterThan(0);
  });

  test('should include metadata', () => {
    expect(paths.name).toEqual(expect.any(String));
    expect(paths.name.length).toBeGreaterThan(0);
    expect(paths.description).toEqual(expect.any(String));
    expect(paths.description.length).toBeGreaterThan(0);
    expect(paths.source).toEqual(expect.any(String));
    expect(paths.source).toMatch(/^https?:\/\/\w+/);
    // expect(paths.bbox).toEqual(expect.any(Array));
    // expect(paths.bbox.length).toBe(4);
    // paths.bbox.forEach((v) => expect(v).toEqual(expect.any(Number)));
  });

  test('should include Features', () => {
    paths.features.forEach((f) => {
      expect(f.type).toBe('Feature');
      expect(f.properties).toEqual(expect.any(Object));
      expect(f.geometry).toEqual(expect.any(Object));

      expect(f.properties.code).toMatch(/[\w-]+/);
      expect(f.properties.name).toMatch(/\w+/);
      expect(f.properties.nameTc).toMatch(/.*/);
      expect(f.properties.locUrl).toMatch(
        /^$|^https:\/\/(?:www\.)?loc.gov\/resource\/g7821rm\.gct00058\/\?/
      );
      expect(f.properties.direction).toMatch(/^$|in|out/);
      expect(f.properties.landmarks).toEqual(expect.any(Array));
      f.properties.landmarks.forEach((landmarkId, index) =>
        // expect(landmarkId, `landmark #${index + 1} in path ${f.properties.code} was not found`).toEqual(expect.any(Number))
        expect(landmarkId).toEqual(expect.any(Number))
      );
      expect(f.properties.text).toEqual(expect.any(String));
      expect(f.properties.translation).toMatch(/\w+/);
      expect(f.properties.millsTranslation).toEqual(expect.any(String));
      expect(f.properties.notes).toEqual(expect.any(String));
      expect(f.properties.textHtml).toEqual(expect.any(String));
      expect(f.properties.translationHtml).toMatch(/\w+/);

      expect(f.geometry.type).toEqual('LineString');

      if (f.geometry.coordinates) {
        expect(f.geometry.coordinates).toEqual(expect.any(Array));
        f.geometry.coordinates.forEach((c) => {
          expect(c).toEqual(expect.any(Array));
          expect(c.length).toEqual(2);
          c.forEach((v) => expect(v).toEqual(expect.any(Number)));
        });
      }

      if (f.geometry.zoomify) {
        expect(f.geometry.zoomify).toEqual(expect.any(Array));
        f.geometry.zoomify.forEach((z) => {
          expect(z).toEqual(expect.any(Array));
          expect(z.length).toEqual(2);
          z.forEach((v) => expect(v).toEqual(expect.any(Number)));
        });
      }
    });
  });
});

describe('maokun-paths-strict.geo.json', () => {
  test('should be a FeatureCollection', () => {
    expect(pathsStrict.type).toBe('FeatureCollection');
    expect(pathsStrict.features).toEqual(expect.any(Array));
    expect(pathsStrict.features.length).toBeGreaterThan(0);
  });

  test('should include valid Features', () => {
    pathsStrict.features.forEach((f) => {
      expect(f.geometry.type).toEqual('LineString');
      expect(f.geometry.coordinates).toEqual(expect.any(Array));
      f.geometry.coordinates.forEach((c) => {
        expect(c).toEqual(expect.any(Array));
        expect(c.length).toEqual(2);
        c.forEach((v) => expect(v).toEqual(expect.any(Number)));
      });
    });
  });
});

// test('', () => {});
