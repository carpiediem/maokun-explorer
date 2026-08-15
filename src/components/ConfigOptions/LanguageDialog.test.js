import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { LocaleContext } from '../../LocaleContext';
import LanguageDialog from './LanguageDialog';

function renderWithLocale(ui, { locale = 'en', setLocale = jest.fn() } = {}) {
  return render(
    <IntlProvider locale="en" messages={{}}>
      <LocaleContext.Provider value={[locale, setLocale]}>{ui}</LocaleContext.Provider>
    </IntlProvider>,
  );
}

describe('when props.open is false', () => {
  test('render nothing', () => {
    renderWithLocale(<LanguageDialog open={false} />);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when clicked outside the dialog', () => {
  test('Triggers onClose callback', () => {
    const closeAction = jest.fn();
    renderWithLocale(<LanguageDialog open onClose={closeAction} />);

    userEvent.click(screen.getByRole('none'));
    expect(closeAction).toHaveBeenCalled();
  });
});

describe('when open', () => {
  test('Displays language options', () => {
    renderWithLocale(<LanguageDialog open />);

    expect(screen.getByText('Choose Language')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('繁體版')).toBeInTheDocument();
  });
});

describe('when an option is clicked', () => {
  test('Changes locale and triggers onClose', () => {
    const setLocale = jest.fn();
    const closeAction = jest.fn();
    renderWithLocale(<LanguageDialog open onClose={closeAction} />, { setLocale });

    userEvent.click(screen.getByText('繁體版'));

    expect(setLocale).toHaveBeenCalledWith('zh');
    expect(closeAction).toHaveBeenCalled();
  });
});
