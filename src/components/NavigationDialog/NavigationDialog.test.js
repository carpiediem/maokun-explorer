import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mediaQuery from 'css-mediaquery';

import { intlEnWrapper } from '../../LocaleContext';
import NavigationDialog from './index';

function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe('when props.open is false', () => {
  test('renders nothing', () => {
    render(<NavigationDialog open={false} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when props.open is true', () => {
  test('renders the title, a direct link, and the known-locations table', () => {
    render(<NavigationDialog open={true} />, intlEnWrapper);

    expect(screen.getByText('Celestial Navigation')).toBeInTheDocument();

    const directLink = screen.getByText('#');
    expect(directLink.getAttribute('href')).toBe('#/navigation');

    expect(screen.getByText('Known Locations')).toBeInTheDocument();
    expect(screen.getByText('Kozhikode, India')).toBeInTheDocument();
  });
});

describe('when props.outlinksDisabled is false', () => {
  test('renders external links for reference stars', () => {
    render(<NavigationDialog open={true} outlinksDisabled={false} />, intlEnWrapper);

    // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
    expect(document.querySelector('a[href="https://en.wikipedia.org/wiki/Polaris"]')).not.toBeNull();
  });
});

describe('when props.outlinksDisabled is true', () => {
  test('renders star names as plain text', () => {
    render(<NavigationDialog open={true} outlinksDisabled={true} />, intlEnWrapper);

    // eslint-disable-next-line testing-library/no-node-access -- confirming no external links are rendered
    expect(document.querySelector('a[href="https://en.wikipedia.org/wiki/Polaris"]')).toBeNull();
    expect(screen.getAllByText('Polaris').length).toBeGreaterThan(0);
  });
});

describe('when screen width is below 960px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(950);
  });

  test('fills the screen and shows a back button', () => {
    const closeAction = jest.fn();
    render(<NavigationDialog open={true} handleClose={closeAction} />, intlEnWrapper);

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

  test('does not fill the screen', () => {
    render(<NavigationDialog open={true} />, intlEnWrapper);

    const dialogPaper = screen.getByRole('dialog');
    expect(dialogPaper).not.toHaveClass('MuiDialog-paperFullScreen');
  });
});
