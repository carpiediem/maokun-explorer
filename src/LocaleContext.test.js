import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LocaleContextProvider, useLocaleContext } from './LocaleContext';

const ORIGINAL_LANGUAGE = navigator.language;

afterEach(() => {
  Object.defineProperty(navigator, 'language', { value: ORIGINAL_LANGUAGE, configurable: true });
});

function LocaleDisplay() {
  const [locale, setLocale] = useLocaleContext();
  return (
    <div>
      <span>locale: {locale}</span>
      <button onClick={() => setLocale('zh')}>switch to zh</button>
    </div>
  );
}

test('provides the browser locale to descendants via useLocaleContext', () => {
  Object.defineProperty(navigator, 'language', { value: 'zh-TW', configurable: true });

  render(
    <LocaleContextProvider>
      <LocaleDisplay />
    </LocaleContextProvider>,
  );

  expect(screen.getByText('locale: zh')).toBeInTheDocument();
});

test('updates the locale for descendants when setLocale is called', () => {
  Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });

  render(
    <LocaleContextProvider>
      <LocaleDisplay />
    </LocaleContextProvider>,
  );

  expect(screen.getByText('locale: en')).toBeInTheDocument();

  userEvent.click(screen.getByText('switch to zh'));

  expect(screen.getByText('locale: zh')).toBeInTheDocument();
});
