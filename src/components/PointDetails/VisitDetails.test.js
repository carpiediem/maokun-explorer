import React from 'react';
import { render, screen } from '@testing-library/react';

import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import voyagesData from './voyages.json';
import VisitDetails from './VisitDetails';

const { YEARS, URLS } = voyagesData;

describe('when voyages is not provided', () => {
  test('renders nothing', () => {
    render(<VisitDetails voyages={undefined} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when voyages is empty', () => {
  test('renders nothing', () => {
    render(<VisitDetails voyages={[]} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when voyages is provided', () => {
  test('renders a chip per voyage, linked by locale', () => {
    render(<VisitDetails voyages={[1, 4]} />, intlEnWrapper);

    expect(screen.getByText('Visited by Treasure-Ships')).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-node-access -- finding the enclosing chip link by its year text
    const first = screen.getByText(YEARS[0]).closest('a');
    expect(first.getAttribute('href')).toBe(URLS.en[0]);

    // eslint-disable-next-line testing-library/no-node-access -- finding the enclosing chip link by its year text
    const fourth = screen.getByText(YEARS[3]).closest('a');
    expect(fourth.getAttribute('href')).toBe(URLS.en[3]);
  });

  test('uses zh-language links when locale is zh', () => {
    render(<VisitDetails voyages={[1]} />, intlZhWrapper);

    // eslint-disable-next-line testing-library/no-node-access -- finding the enclosing chip link by its year text
    const first = screen.getByText(YEARS[0]).closest('a');
    expect(first.getAttribute('href')).toBe(URLS.zh[0]);
  });
});
