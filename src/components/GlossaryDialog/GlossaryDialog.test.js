import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import mediaQuery from 'css-mediaquery';

import { LocaleContext } from '../../LocaleContext';
import defaultMessages from '../../translations/en.json';
import zhMessages from '../../translations/zh';
import GlossaryDialog from './index';

function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

const MESSAGES = {
  en: defaultMessages,
  zh: Object.assign({}, defaultMessages, zhMessages),
};

function localeWrapper(locale) {
  return {
    wrapper: ({ children }) => (
      <LocaleContext.Provider value={[locale, () => {}]}>
        <IntlProvider locale={locale} messages={MESSAGES[locale]}>
          {children}
        </IntlProvider>
      </LocaleContext.Provider>
    ),
  };
}

describe('when props.open is false', () => {
  test('renders nothing', () => {
    render(<GlossaryDialog open={false} />, localeWrapper('en'));
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when props.open is true', () => {
  test('renders the glossary title, subheaders, and a direct link', () => {
    render(<GlossaryDialog open={true} />, localeWrapper('en'));

    expect(screen.getByText('Glossary of Unusual Chinese Characters')).toBeInTheDocument();
    expect(screen.getByText('Ming Government Organization')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Stars')).toBeInTheDocument();

    const directLink = screen.getByText('#');
    expect(directLink.getAttribute('href')).toBe('#/glossary');
  });

  test('renders an entry for every glossary term', () => {
    render(<GlossaryDialog open={true} />, localeWrapper('en'));

    ['衛', '所', '更', '針', '托', '指', '角', '北辰', '華蓋', '布司', '斗', '落', '上'].forEach((character) => {
      expect(screen.getByText(character)).toBeInTheDocument();
    });
  });
});

describe('when locale is en', () => {
  test('links to English-language external sources', () => {
    render(<GlossaryDialog open={true} />, localeWrapper('en'));

    // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
    const link = document.querySelector('a[href="https://en.wikipedia.org/wiki/Polaris"]');
    expect(link).not.toBeNull();
  });
});

describe('when locale is zh', () => {
  test('links to Chinese-language external sources', () => {
    render(<GlossaryDialog open={true} />, localeWrapper('zh'));

    // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
    const link = document.querySelector('a[href="https://zh.wikipedia.org/wiki/%E5%8B%BE%E9%99%B3%E4%B8%80"]');
    expect(link).not.toBeNull();
  });
});

describe('when props.outlinksDisabled is true', () => {
  test('does not render external links', () => {
    render(<GlossaryDialog open={true} outlinksDisabled />, localeWrapper('en'));

    // eslint-disable-next-line testing-library/no-node-access -- matching links by class, not accessible content
    expect(document.querySelector('a.external')).toBeNull();
  });
});

describe('when screen width is below 960px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(950);
  });

  test('fills the screen and shows a back button', () => {
    const closeAction = jest.fn();
    render(<GlossaryDialog open={true} handleClose={closeAction} />, localeWrapper('en'));

    const dialogPaper = screen.getByRole('dialog');
    expect(dialogPaper).toHaveClass('MuiDialog-paperFullScreen');

    userEvent.click(screen.getByRole('button'));
    expect(closeAction).toHaveBeenCalled();
  });
});

describe('when screen width is at least 960px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(1200);
  });

  test('does not show a back button', () => {
    render(<GlossaryDialog open={true} />, localeWrapper('en'));

    expect(screen.queryByRole('button')).toBeNull();
  });
});
