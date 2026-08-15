import React from 'react';
import { render, screen } from '@testing-library/react';

import PointHeader from './PointHeader';

test('renders the label, pinyin, and translation', () => {
  render(<PointHeader label="古里" pinyin="Gǔlǐ" translation="Kozhikode" />);

  expect(screen.getByText('古里')).toBeInTheDocument();
  expect(screen.getByText('Gǔlǐ')).toBeInTheDocument();
  expect(screen.getByText('Kozhikode')).toBeInTheDocument();
});
