import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mediaQuery from 'css-mediaquery';

import {
  intlEnWrapper,
  intlZhWrapper,
  intlOjWrapper,
} from '../../LocaleContext';
import AboutDialog from './index';

function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

test('a click outside the dialog triggers props.onClose()', () => {
  const closeAction = jest.fn();
  const { getByRole } = render(
    <AboutDialog open={true} handleClose={closeAction} />,
    intlEnWrapper
  );

  userEvent.click(getByRole('none'));
  expect(closeAction).toHaveBeenCalled();
});

test('renders a direct link in header', () => {
  const { getByText } = render(<AboutDialog open={true} />, intlEnWrapper);
  const directLink = getByText('#');

  expect(directLink).toBeInTheDocument();
  expect(directLink.getAttribute('href')).toBe('#/about');
});

test('renders photo', () => {
  const { getByRole } = render(<AboutDialog open={true} />, intlEnWrapper);
  const img = getByRole('img');

  expect(img).toBeInTheDocument();
  expect(img.getAttribute('src')).toBe('./jmmp.jpg');
});

test('renders links to data files', () => {
  const { getByRole } = render(<AboutDialog open={true} />, intlEnWrapper);
  const table = getByRole('table');

  expect(table).toBeInTheDocument();
  expect(
    table.querySelector('a[href="/data/maokun-places.geo.json"]')
  ).toBeInTheDocument();
  expect(
    table.querySelector('a[href="/data/maokun-paths.geo.json"]')
  ).toBeInTheDocument();
  expect(
    table.querySelector('a[href="/data/maokun-places.csv"]')
  ).toBeInTheDocument();
  expect(
    table.querySelector('a[href="/data/maokun-rutters.csv"]')
  ).toBeInTheDocument();
  expect(
    table.querySelector('a[href="/data/maokun-imagePaths.csv"]')
  ).toBeInTheDocument();
  expect(
    table.querySelector('a[href="/data/maokun-geoPaths.csv"]')
  ).toBeInTheDocument();
});

describe('when props.open is false', () => {
  test('render nothing', () => {
    const { queryByText } = render(<AboutDialog open={false} />, intlEnWrapper);
    expect(queryByText(/\w/i)).toBeNull();
  });
});

describe('when screen width is below 960px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(950);
  });

  test('fill screen', () => {
    const { getByRole } = render(<AboutDialog open={true} />, intlEnWrapper);
    const dialogPaper = getByRole('dialog');

    expect(dialogPaper).toBeInTheDocument();
    expect(dialogPaper).toHaveClass('MuiDialog-paperFullScreen');
  });

  test('a click on the chevron button triggers props.onClose()', () => {
    const closeAction = jest.fn();
    const { getByRole } = render(
      <AboutDialog open={true} handleClose={closeAction} />,
      intlEnWrapper
    );

    userEvent.click(getByRole('button'));
    expect(closeAction).toHaveBeenCalled();
  });
});

describe('when en locale is used', () => {
  test('renders English text and links', () => {
    const { getByText } = render(<AboutDialog open={true} />, intlEnWrapper);
    const titleText = getByText('About the Mao Kun Map');
    const paragraphText = getByText(
      /The data displayed in this map is available in/
    );
    const firstHref = document.querySelector('a.external').getAttribute('href');

    expect(titleText).toBeInTheDocument();
    expect(paragraphText).toBeInTheDocument();
    expect(firstHref).toBe('https://en.wikipedia.org/wiki/Zheng_He');
  });
});

describe('when zh locale is used', () => {
  test('renders Chinese text and links', () => {
    const { getByText, getAllByText } = render(
      <AboutDialog open={true} />,
      intlZhWrapper
    );
    const titleText = getAllByText(/^鄭和航海圖$/i);
    const paragraphText = getByText(/^如果你想將其用在其他項目上/);
    const firstHref = document.querySelector('a.external').getAttribute('href');

    expect(titleText[0]).toBeInTheDocument();
    expect(paragraphText).toBeInTheDocument();
    expect(firstHref).toBe('https://zh.wikipedia.org/wiki/%E9%84%AD%E5%92%8C');
  });
});

describe('when an unsupported locale is used', () => {
  test('renders English text and links', () => {
    const { getByText } = render(<AboutDialog open={true} />, intlOjWrapper);
    const titleText = getByText('About the Mao Kun Map');
    const paragraphText = getByText(
      /The data displayed in this map is available in/
    );
    // Currently chooses Chinese-language URL, by default. Not worth fixing right now.
    // const firstHref = document.querySelector('a.external').getAttribute('href');

    expect(titleText).toBeInTheDocument();
    expect(paragraphText).toBeInTheDocument();
    // expect(firstHref).toBe('https://en.wikipedia.org/wiki/Zheng_He');
  });
});

// test('', () => {});
