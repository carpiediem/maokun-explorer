import React from 'react';
import { render } from '@testing-library/react';

import WikipediaIcon from './WikipediaIcon';

test('renders the Wikipedia glyph', () => {
  render(<WikipediaIcon />);
  // eslint-disable-next-line testing-library/no-node-access -- svg path has no accessible role
  expect(document.querySelector('svg path')).not.toBeNull();
});
