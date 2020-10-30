import React from 'react';
import { useIntl } from 'react-intl';
import Chip from '@material-ui/core/Chip';

import COLORS from '../ConfigOptions/categories-colors.json';

function CategoryChip({ category }) {
  const intl = useIntl();

  return (
    <Chip
      size="small"
      label={intl.formatMessage({
        id: `categories.${category.toLowerCase()}`,
        defaultMessage: category,
      })}
      style={{ backgroundColor: COLORS[category] }}
    />
  );
}

export default CategoryChip;
