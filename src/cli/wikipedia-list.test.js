jest.mock('fs');

const FEATURES = [
  {
    properties: {
      label: 'F1',
      pinyin: 'pinyin1',
      translation: 'translation1',
      nameEn: 'Foo1',
      region: 'Region1',
      page: 1,
      sourceUrl: 'https://books.google.com.hk/books?id=DjQ9AAAAIAAJ&pg=PA261',
    },
  },
  {
    properties: {
      label: 'F2',
      pinyin: 'pinyin2',
      translation: 'translation2',
      nameEn: 'Foo2',
      region: 'Region2',
      page: 2,
      sourceUrl: 'http://www.world10k.com/blog/?p=123',
    },
  },
  {
    properties: {
      label: 'F3',
      pinyin: 'pinyin3',
      translation: 'translation3',
      nameEn: 'Foo3',
      region: 'Region3',
      page: 3,
      sourceUrl:
        'https://baike.baidu.com/item/%E6%96%B0%E7%BC%96%E9%83%91%E5%92%8C%E8%88%AA%E6%B5%B7%E5%9B%BE%E9%9B%86',
    },
  },
  {
    properties: {
      label: 'F4',
      pinyin: 'pinyin4',
      translation: 'translation4',
      nameEn: '--',
      region: 'Region4',
      page: 4,
      sourceUrl: 'https://example.com/unmatched',
    },
  },
  {
    properties: {
      label: 'F5',
      pinyin: 'pinyin5',
      translation: 'translation5',
      nameEn: 'Foo5',
      region: 'Region5',
      page: 5,
      sourceUrl: '',
    },
  },
  {
    properties: {
      label: 'Excluded',
      pinyin: 'pinyinX',
      translation: 'translationX',
      nameEn: 'Excluded',
      region: 'RegionX',
      page: 0,
      sourceUrl: '',
    },
  },
];

jest.mock('../../public/data/maokun-places.geo.json', () => ({ features: FEATURES }), { virtual: true });

test('writes a wikitable markdown row for every feature with a page, with references by source', () => {
  const { writeFileSync } = require('fs');

  require('./wikipedia-list');

  const [path, content, options] = writeFileSync.mock.calls[0];
  expect(path).toBe('public/data/wikipedia-list.md');
  expect(options).toEqual({ encoding: 'UTF-8' });

  expect(content).toContain('{| class="wikitable plainrowheaders"');
  expect(content.trim().endsWith('|}')).toBe(true);

  // Excluded (page: 0) is left out entirely.
  expect(content).not.toContain('Excluded');

  // F1: books.google.com.hk reference
  expect(content).toContain(
    "! F1\n| pinyin1\n| style=\"text-align:left\" | translation1\n| [[Foo1]]<ref>{{cite book |pages=261 |title= Ying-Yai Sheng-Lan: 'The Overall Survey of the Ocean's Shores' |author=Ma Huan |editor=J.V.G. Mills |year=1970 |isbn=9780521010320}}</ref>\n| Region1\n| [https://loc.gov/resource/g7821rm.gct00058/?sp=1 1]",
  );

  // F2: world10k.com reference
  expect(content).toContain(
    '<ref>{{cite web |url= http://www.world10k.com/blog/?p=123 |author=<!--Not stated--> |title= 南溟網 |publisher= 陈佳荣}}</ref>',
  );

  // F3: baidu reference
  expect(content).toContain(
    '<ref>{{cite book |title= 新编郑和航海图集 |author=海军海洋测绘研究所 |year=1988 |isbn=9787114002298}}</ref>',
  );

  // F4: unmatched source (no ref) and nameEn === '--' rendered without link brackets
  expect(content).toContain('| --\n| Region4');

  // F5: empty sourceUrl (no ref, buildRef's early return)
  expect(content).toContain('| [[Foo5]]\n| Region5');
});
