import React from 'react';
import { render, screen } from '@testing-library/react';

import { intlEnWrapper } from '../../LocaleContext';
import COLORS from '../ConfigOptions/categories-colors.json';
import CategoryChip from './CategoryChip';

test('renders a chip labeled with the category, colored by category', () => {
  render(<CategoryChip category="town" />, intlEnWrapper);

  const label = screen.getByText('town');
  // eslint-disable-next-line testing-library/no-node-access -- finding the enclosing chip by its label text
  expect(label.closest('.MuiChip-root')).toHaveStyle({ backgroundColor: COLORS.town });
});
