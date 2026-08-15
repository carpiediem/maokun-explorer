import React from 'react';
import { render } from '@testing-library/react';

import Continent from './Continent';

test('renders the continent path', () => {
  render(
    <svg>
      <Continent />
    </svg>,
  );

  // eslint-disable-next-line testing-library/no-node-access -- svg path has no accessible role
  expect(document.querySelector('path#continent')).not.toBeNull();
});
