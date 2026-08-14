import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper, intlZhWrapper } from '../../../LocaleContext';
import WikipediaFlexiButton from './index';

describe('when neither wikiEn nor wikiZh is provided', () => {
  test('renders nothing', () => {
    render(<WikipediaFlexiButton />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when only wikiEn is provided', () => {
  test('renders a single link to wikiEn', () => {
    render(<WikipediaFlexiButton wikiEn="https://en.wikipedia.org/wiki/Foo" />, intlEnWrapper);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('https://en.wikipedia.org/wiki/Foo');
  });
});

describe('when only wikiZh is provided', () => {
  test('renders a single link to wikiZh', () => {
    render(<WikipediaFlexiButton wikiZh="https://zh.wikipedia.org/wiki/Foo" />, intlEnWrapper);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('https://zh.wikipedia.org/wiki/Foo');
  });
});

describe('when both wikiEn and wikiZh are provided', () => {
  const props = {
    wikiEn: 'https://en.wikipedia.org/wiki/Foo',
    wikiZh: 'https://zh.wikipedia.org/wiki/Foo',
  };

  test('the primary link points to wikiEn in the en locale', () => {
    render(<WikipediaFlexiButton {...props} />, intlEnWrapper);

    const links = screen.getAllByRole('link');
    expect(links[0].getAttribute('href')).toBe(props.wikiEn);
  });

  test('the primary link points to wikiZh in the zh locale', () => {
    render(<WikipediaFlexiButton {...props} />, intlZhWrapper);

    const links = screen.getAllByRole('link');
    expect(links[0].getAttribute('href')).toBe(props.wikiZh);
  });

  test('the dropdown toggles a menu with both language options', () => {
    render(<WikipediaFlexiButton {...props} />, intlEnWrapper);

    expect(screen.queryByText('English Wikipedia')).toBeNull();

    userEvent.click(screen.getByLabelText('select merge strategy'));
    expect(screen.getByText('English Wikipedia')).toBeInTheDocument();
    expect(screen.getByText('中文維基百科')).toBeInTheDocument();
  });
});
