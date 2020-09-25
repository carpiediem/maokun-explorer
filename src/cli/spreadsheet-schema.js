module.exports = {
  POINTS_URL:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRCnOUkZQny1c1vQttf8pl_Qe0rsVitpGgr4E7Dfior8pTHyPvDEXRSaPpAebcOyLkG4SpsaiPP9qPl/pub?gid=16191930&single=true&output=csv',
  RUTTERS_URL:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRCnOUkZQny1c1vQttf8pl_Qe0rsVitpGgr4E7Dfior8pTHyPvDEXRSaPpAebcOyLkG4SpsaiPP9qPl/pub?gid=1045580293&single=true&output=tsv',
  IMAGE_PATH_URL:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRCnOUkZQny1c1vQttf8pl_Qe0rsVitpGgr4E7Dfior8pTHyPvDEXRSaPpAebcOyLkG4SpsaiPP9qPl/pub?gid=1071465363&single=true&output=csv',
  GEO_PATH_URL:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRCnOUkZQny1c1vQttf8pl_Qe0rsVitpGgr4E7Dfior8pTHyPvDEXRSaPpAebcOyLkG4SpsaiPP9qPl/pub?gid=1172460950&single=true&output=csv',

  POINTS_EDITOR:
    'https://docs.google.com/spreadsheets/d/1liMvgTCOXhTub3B8A_jdlDXT2IKmDCkr00rUQvpBSqw/edit#gid=16191930',
  PATHS_EDITOR:
    'https://docs.google.com/spreadsheets/d/1liMvgTCOXhTub3B8A_jdlDXT2IKmDCkr00rUQvpBSqw/edit#gid=1045580293',

  POINTS_COLUMNS: [
    'label',
    'pinyin',
    'translation',
    'nameTc',
    'nameEn',
    'othersTc',
    'othersEn',
    'region',
    'category',
    'kamalNotes',
    'sourceUrl',
    'wikiEn',
    'wikiZh',
    'locUrl',
    'page',
    'x',
    'y',
    'lat',
    'lng',
    'kamalAngle',
    null,
    null,
  ],
  RUTTERS_COLUMNS: [
    'code',
    'name',
    'locUrl',
    'direction',
    'landmarks',
    'text',
    'translation',
    'millsTranslation',
    'textHtml',
    'translationHtml',
  ],
  IMAGE_PATH_COLUMNS: ['code', 'x', 'y'],
  GEO_PATH_COLUMNS: [
    'code',
    'lat',
    'lng',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],

  cast: (value, { column }) => {
    switch (column) {
      case 'page':
        return parseInt(value, 10);
      case 'x':
      case 'y':
      case 'lat':
      case 'lng':
      case 'kamalAngle':
        return parseFloat(value) || null;
      case 'landmarks':
        return value.split(',');
      default:
        return value;
    }
  },
};
