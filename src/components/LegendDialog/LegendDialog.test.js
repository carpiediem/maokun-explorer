import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mediaQuery from 'css-mediaquery';

import { intlEnWrapper } from '../../LocaleContext';
import CATEGORIES from '../ConfigOptions/categories.json';
import LegendDialog from './index';

function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe('when props.open is false', () => {
  test('renders nothing', () => {
    render(<LegendDialog open={false} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when props.open is true', () => {
  test('renders the title, a direct link, every category, and the unidentified entry', () => {
    render(<LegendDialog open={true} />, intlEnWrapper);

    expect(screen.getByText('Map Legend')).toBeInTheDocument();

    const directLink = screen.getByText('#');
    expect(directLink.getAttribute('href')).toBe('#/legend');

    CATEGORIES.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
    expect(screen.getByText('Unidentified Locations')).toBeInTheDocument();
  });
});

describe('when screen width is below 600px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(500);
  });

  test('fills the screen and shows a back button', () => {
    const closeAction = jest.fn();
    render(<LegendDialog open={true} handleClose={closeAction} />, intlEnWrapper);

    const dialogPaper = screen.getByRole('dialog');
    expect(dialogPaper).toHaveClass('MuiDialog-paperFullScreen');

    userEvent.click(screen.getByRole('button'));
    expect(closeAction).toHaveBeenCalled();
  });
});

describe('when screen width is at least 600px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(1200);
  });

  test('does not show a back button', () => {
    render(<LegendDialog open={true} />, intlEnWrapper);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
