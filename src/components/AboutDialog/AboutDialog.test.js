import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mediaQuery from 'css-mediaquery';

import { intlEnWrapper, intlZhWrapper, intlOjWrapper } from '../../LocaleContext';
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
  render(<AboutDialog open={true} handleClose={closeAction} />, intlEnWrapper);

  userEvent.click(screen.getByRole('none'));
  expect(closeAction).toHaveBeenCalled();
});

test('renders a direct link in header', () => {
  render(<AboutDialog open={true} />, intlEnWrapper);
  const directLink = screen.getByText('#');

  expect(directLink).toBeInTheDocument();
  expect(directLink.getAttribute('href')).toBe('#/about');
});

test('renders photo', () => {
  render(<AboutDialog open={true} />, intlEnWrapper);
  const img = screen.getByRole('img');

  expect(img).toBeInTheDocument();
  expect(img.getAttribute('src')).toBe('./images/jmmp.jpg');
});

test('renders links to data files', () => {
  render(<AboutDialog open={true} />, intlEnWrapper);
  const table = screen.getByRole('table');

  expect(table).toBeInTheDocument();
  // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
  expect(table.querySelector('a[href="/data/maokun-places.geo.json"]')).toBeInTheDocument();
  // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
  expect(table.querySelector('a[href="/data/maokun-paths.geo.json"]')).toBeInTheDocument();
  // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
  expect(table.querySelector('a[href="/data/maokun-places.csv"]')).toBeInTheDocument();
  // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
  expect(table.querySelector('a[href="/data/maokun-rutters.csv"]')).toBeInTheDocument();
  // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
  expect(table.querySelector('a[href="/data/maokun-imagePaths.csv"]')).toBeInTheDocument();
  // eslint-disable-next-line testing-library/no-node-access -- matching links by href, not accessible content
  expect(table.querySelector('a[href="/data/maokun-geoPaths.csv"]')).toBeInTheDocument();
});

describe('when props.open is false', () => {
  test('render nothing', () => {
    render(<AboutDialog open={false} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when props.outlinksDisabled is true', () => {
  test('renders the QR code message and image instead of the data table', () => {
    render(<AboutDialog open={true} outlinksDisabled />, intlEnWrapper);

    expect(screen.getByText(/please visit the site on your own device/)).toBeInTheDocument();
    expect(screen.queryByText('Full data set')).toBeNull();
    expect(screen.getByAltText("QR code of this page's URL")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access -- confirming no external links are rendered
    expect(document.querySelector('a.external')).toBeNull();
  });
});

describe('when screen width is below 960px', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(950);
  });

  test('fill screen', () => {
    render(<AboutDialog open={true} />, intlEnWrapper);
    const dialogPaper = screen.getByRole('dialog');

    expect(dialogPaper).toBeInTheDocument();
    expect(dialogPaper).toHaveClass('MuiDialog-paperFullScreen');
  });

  test('a click on the chevron button triggers props.onClose()', () => {
    const closeAction = jest.fn();
    render(<AboutDialog open={true} handleClose={closeAction} />, intlEnWrapper);

    userEvent.click(screen.getByRole('button'));
    expect(closeAction).toHaveBeenCalled();
  });
});

describe('when en locale is used', () => {
  test('renders English text and links', () => {
    render(<AboutDialog open={true} />, intlEnWrapper);
    const titleText = screen.getByText('About the Mao Kun Map');
    const paragraphText = screen.getByText(/The data displayed in this map is available in/);
    // eslint-disable-next-line testing-library/no-node-access -- matching link by class, not accessible content
    const firstHref = document.querySelector('a.external').getAttribute('href');

    expect(titleText).toBeInTheDocument();
    expect(paragraphText).toBeInTheDocument();
    expect(firstHref).toBe('https://en.wikipedia.org/wiki/Zheng_He');
  });
});

describe('when zh locale is used', () => {
  test('renders Chinese text and links', () => {
    render(<AboutDialog open={true} />, intlZhWrapper);
    const titleText = screen.getAllByText(/^鄭和航海圖$/i);
    const paragraphText = screen.getByText(/^如果你想將其用在其他項目上/);
    // eslint-disable-next-line testing-library/no-node-access -- matching link by class, not accessible content
    const firstHref = document.querySelector('a.external').getAttribute('href');

    expect(titleText[0]).toBeInTheDocument();
    expect(paragraphText).toBeInTheDocument();
    expect(firstHref).toBe('https://zh.wikipedia.org/wiki/%E9%84%AD%E5%92%8C');
  });
});

describe('when an unsupported locale is used', () => {
  test('renders English text and links', () => {
    render(<AboutDialog open={true} />, intlOjWrapper);
    const titleText = screen.getByText('About the Mao Kun Map');
    const paragraphText = screen.getByText(/The data displayed in this map is available in/);
    // Currently chooses Chinese-language URL, by default. Not worth fixing right now.
    // const firstHref = document.querySelector('a.external').getAttribute('href');

    expect(titleText).toBeInTheDocument();
    expect(paragraphText).toBeInTheDocument();
    // expect(firstHref).toBe('https://en.wikipedia.org/wiki/Zheng_He');
  });
});

// test('', () => {});
