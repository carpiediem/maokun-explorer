import React from 'react';
import { render, screen } from '@testing-library/react';

import { intlEnWrapper } from '../../LocaleContext';
import OtherPossibilities from './OtherPossibilities';

describe('when text is not provided', () => {
  test('renders nothing', () => {
    render(<OtherPossibilities text="" />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when text is provided', () => {
  test('splits the citation out of the text', () => {
    render(<OtherPossibilities text="possibly a different port [Smith, 1990]" />, intlEnWrapper);

    expect(screen.getByText('Other Possibilities')).toBeInTheDocument();

    const citation = screen.getByText('[Smith, 1990]');
    expect(citation.tagName).toBe('SMALL');
    // eslint-disable-next-line testing-library/no-node-access -- finding the enclosing paragraph by its citation text
    expect(citation.closest('p')).toHaveTextContent('possibly a different port [Smith, 1990]');
  });
});
