import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';
import { LocaleContext } from './LocaleContext';

jest.mock('./screens/Explorer', () => () => {
  const { FormattedMessage } = require('react-intl');
  return (
    <div data-testid="explorer">
      <FormattedMessage id="menu.title" defaultMessage="Mao Kun Explorer" />
    </div>
  );
});

function renderWithLocale(locale) {
  return render(
    <LocaleContext.Provider value={[locale, jest.fn()]}>
      <App />
    </LocaleContext.Provider>,
  );
}

test('renders Explorer under an IntlProvider using the English translations', () => {
  renderWithLocale('en');

  expect(screen.getByTestId('explorer')).toBeInTheDocument();
  expect(screen.getByText('Mao Kun Explorer')).toBeInTheDocument();
});

test('renders Explorer under an IntlProvider using the Traditional Chinese translations', () => {
  renderWithLocale('zh');

  expect(screen.getByTestId('explorer')).toBeInTheDocument();
  expect(screen.getByText('繼鄭和')).toBeInTheDocument();
});
