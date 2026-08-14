import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mediaQuery from 'css-mediaquery';

import { intlEnWrapper } from '../../LocaleContext';
import IntroDialog from './index';

function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe('when props.open is false', () => {
  test('renders nothing', () => {
    render(<IntroDialog open={false} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when props.open is true', () => {
  test('renders the title and abstract', () => {
    render(<IntroDialog open={true} />, intlEnWrapper);

    expect(screen.getByText('Mao Kun Explorer')).toBeInTheDocument();
    expect(screen.getByText(/The Mao Kun Map plots a 15th-century journey/)).toBeInTheDocument();
  });

  test('clicking the button triggers props.handleClose()', () => {
    const closeAction = jest.fn();
    render(<IntroDialog open={true} handleClose={closeAction} />, intlEnWrapper);

    userEvent.click(screen.getByText('Take a Look'));
    expect(closeAction).toHaveBeenCalled();
  });
});

describe('when screen width is below 960px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(950);
  });

  test('fills the screen', () => {
    render(<IntroDialog open={true} />, intlEnWrapper);

    const dialogPaper = screen.getByRole('dialog');
    expect(dialogPaper).toHaveClass('MuiDialog-paperFullScreen');
  });
});

describe('when screen width is at least 960px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(1200);
  });

  test('does not fill the screen', () => {
    render(<IntroDialog open={true} />, intlEnWrapper);

    const dialogPaper = screen.getByRole('dialog');
    expect(dialogPaper).not.toHaveClass('MuiDialog-paperFullScreen');
  });
});
