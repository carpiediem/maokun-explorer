const { writeFileSync } = require('fs');
const { features } = require('../../public/data/maokun-places.geo.json');

// https://en.wikipedia.org/wiki/Draft:List_of_places_depicted_in_the_Mao_Kun_Map

const ENCUTF = { encoding: 'UTF-8' };
const HEADER = `{| class="wikitable plainrowheaders" style="text-align:center; width:99%"
! scope="col" | Label
! scope="col" | Pinyin
! scope="col" | Translation
! scope="col" | Location
! scope="col" | Country/Province
! scope="col" | Page`;
const FOOTER = `
|}`;

function buildRef(sourceUrl) {
  const urlMatch = /(^[^?]+)(?:\?id=DjQ9AAAAIAAJ&pg=PA|\?p=)?(\d*)/.exec(
    sourceUrl
  );

  if (!urlMatch) return '';

  switch (urlMatch[1]) {
    case 'https://books.google.com.hk/books':
      return `<ref>{{cite book |pages=${urlMatch[2]} |title= Ying-Yai Sheng-Lan: 'The Overall Survey of the Ocean's Shores' |author=Ma Huan |editor=J.V.G. Mills |year=1970 |isbn=9780521010320}}</ref>`;
    case 'http://www.world10k.com/blog/':
      return `<ref>{{cite web |url= ${sourceUrl} |author=<!--Not stated--> |title= 南溟網 |publisher= 陈佳荣}}</ref>`;
    case 'https://baike.baidu.com/item/%E6%96%B0%E7%BC%96%E9%83%91%E5%92%8C%E8%88%AA%E6%B5%B7%E5%9B%BE%E9%9B%86':
      return `<ref>{{cite book |title= 新编郑和航海图集 |author=海军海洋测绘研究所 |year=1988 |isbn=9787114002298}}</ref>`;
    default:
      return '';
  }
}

function buildRow({ properties }) {
  const name = properties.nameEn === '--' ? '--' : `[[${properties.nameEn}]]`;

  return `
|-
! ${properties.label}
| ${properties.pinyin}
| style="text-align:left" | ${properties.translation}
| ${name}${buildRef(properties.sourceUrl)}
| ${properties.region}
| [https://loc.gov/resource/g7821rm.gct00058/?sp=1 ${properties.page}]`;
}

writeFileSync(
  'public/data/wikipedia-list.md',
  `${HEADER}${features
    .filter((p) => p.properties.page)
    .map(buildRow)
    .join('')}${FOOTER}`,
  ENCUTF
);
