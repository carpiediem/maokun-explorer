// @see https://tools.ietf.org/rfc/bcp/bcp47.txt

function getBrowserLocale() {
  switch (navigator.language) {
    case 'zh':
    case 'zh-Hant':
    case 'zh-Hans':
    case 'zh-TW':
    case 'zh-HK':
    case 'zh-CN':
      return 'zh';
    // case "zh-CN":
    //   return "zh-CN";
    default:
      return 'en';
  }
}

export default getBrowserLocale;
