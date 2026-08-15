import getBrowserLocale from './getBrowserLocale';

const ORIGINAL_LANGUAGE = navigator.language;

function setLanguage(language) {
  Object.defineProperty(navigator, 'language', { value: language, configurable: true });
}

afterEach(() => {
  setLanguage(ORIGINAL_LANGUAGE);
});

test.each(['zh', 'zh-Hant', 'zh-Hans', 'zh-TW', 'zh-HK', 'zh-CN'])('maps browser language "%s" to "zh"', (language) => {
  setLanguage(language);
  expect(getBrowserLocale()).toBe('zh');
});

test('defaults to "en" for any other browser language', () => {
  setLanguage('fr');
  expect(getBrowserLocale()).toBe('en');
});
