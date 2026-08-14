import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper } from '../../LocaleContext';
import defaultPreferences from './default-preferences.json';
import Menu from './index';

beforeEach(() => {
  global.gtag = jest.fn();
});

afterEach(() => {
  delete global.gtag;
});

function drawerRoot() {
  // eslint-disable-next-line testing-library/no-node-access -- the Drawer root has no accessible role of its own
  return document.querySelector('.MuiDrawer-root');
}

test('the drawer is closed until the menu button is clicked', () => {
  render(<Menu prefs={defaultPreferences} setDialog={jest.fn()} />, intlEnWrapper);

  expect(screen.queryByText('Mao Kun Explorer')).toBeNull();

  userEvent.click(screen.getByLabelText('open menu'));
  expect(drawerRoot().getAttribute('aria-hidden')).toBeNull();
  expect(screen.getByText('Mao Kun Explorer')).toBeInTheDocument();
});

test('reports the menu toggle to analytics', () => {
  render(<Menu prefs={defaultPreferences} setDialog={jest.fn()} />, intlEnWrapper);

  userEvent.click(screen.getByLabelText('open menu'));
  expect(global.gtag).toHaveBeenCalledWith('event', 'menu toggled', expect.objectContaining({ value: true }));
});

describe('when the close chevron is clicked', () => {
  test('closes the drawer', () => {
    render(<Menu prefs={defaultPreferences} setDialog={jest.fn()} />, intlEnWrapper);

    userEvent.click(screen.getByLabelText('open menu'));
    // eslint-disable-next-line testing-library/no-node-access -- the close chevron has no accessible label
    userEvent.click(document.querySelector('.header button'));

    expect(drawerRoot().getAttribute('aria-hidden')).toBe('true');
  });
});

describe('when a submenu item is clicked', () => {
  test.each([
    ['About the Map', 'about'],
    ['Map Legend', 'legend'],
    ['Glossary', 'glossary'],
    ['Celestial Navigation', 'navigation'],
  ])('clicking "%s" sets the dialog to "%s" and closes the drawer', (label, dialogKey) => {
    const setDialog = jest.fn();
    render(<Menu prefs={defaultPreferences} setDialog={setDialog} />, intlEnWrapper);

    userEvent.click(screen.getByLabelText('open menu'));
    userEvent.click(screen.getByText(label));

    expect(setDialog).toHaveBeenCalledWith(dialogKey);
    expect(drawerRoot().getAttribute('aria-hidden')).toBe('true');
  });
});
