import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { LocaleContext } from '../../LocaleContext';
import defaultMessages from '../../translations/en.json';
import ConfigOptions from './index';

function renderConfigOptions(props, { locale = 'en', setLocale = jest.fn() } = {}) {
  return render(
    <IntlProvider locale="en" messages={defaultMessages}>
      <LocaleContext.Provider value={[locale, setLocale]}>
        <ConfigOptions {...props} />
      </LocaleContext.Provider>
    </IntlProvider>,
  );
}

describe('when a language option is selected', () => {
  test('Updates the locale via context and closes the language dialog', async () => {
    const setLocale = jest.fn();
    renderConfigOptions({}, { setLocale });

    userEvent.click(screen.getByText('Language'));
    userEvent.click(screen.getByText('繁體版'));

    expect(setLocale).toHaveBeenCalledWith('zh');
    await waitFor(() => expect(screen.queryByText('Choose Language')).toBeNull());
  });
});

describe('when a filter option is toggled', () => {
  test('Triggers onChange and closing the dialog hides it', async () => {
    const changeAction = jest.fn();
    renderConfigOptions({ onChange: changeAction, categories: { town: false } });

    userEvent.click(screen.getByText('Filter Markers'));
    fireEvent.click(screen.getByRole('checkbox', { name: 'town' }));

    expect(changeAction).toHaveBeenCalledWith('categories', { town: true });

    userEvent.click(screen.getByRole('none'));
    await waitFor(() => expect(screen.queryByText('town')).toBeNull());
  });
});
