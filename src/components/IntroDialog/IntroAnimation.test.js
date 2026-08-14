import React from 'react';
import { render } from '@testing-library/react';

import IntroAnimation from './IntroAnimation';

test('renders the continent, animated paths, and labels', () => {
  render(<IntroAnimation />);

  // eslint-disable-next-line testing-library/no-node-access -- svg elements have no accessible role
  expect(document.querySelector('path#continent')).not.toBeNull();

  ['coastline', 'hainan-island', 'ceylon', 'sumatra', 'borneo', 'java'].forEach((id) => {
    // eslint-disable-next-line testing-library/no-node-access -- svg paths have no accessible role
    expect(document.querySelector(`path#${id}`)).not.toBeNull();
  });

  ['nanjing', 'quinhon', 'kozhikode', 'hormuz', 'malindi'].forEach((id) => {
    // eslint-disable-next-line testing-library/no-node-access -- svg text has no accessible role
    expect(document.querySelector(`text#${id}`)).not.toBeNull();
  });
});
