import React from 'react';
import { render, screen } from '@testing-library/react';

import { intlEnWrapper } from '../../LocaleContext';
import KamalDetails from './KamalDetails';

describe('when text is not provided', () => {
  test('renders nothing', () => {
    render(<KamalDetails text="" angle={4} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when text is provided', () => {
  test('renders the measurement note and the calculated latitude', () => {
    render(<KamalDetails text="four fingers above the horizon" angle={4} />, intlEnWrapper);

    expect(screen.getByText('Kamal Measurement')).toBeInTheDocument();
    expect(screen.getByText('four fingers above the horizon')).toBeInTheDocument();
    expect(screen.getByText(/≈/)).toHaveTextContent('4 fingers ≈ 10.26° N latitude');
  });
});
