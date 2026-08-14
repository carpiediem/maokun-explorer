import React from 'react';
import { render, screen } from '@testing-library/react';

import SelectionDrawer from './index';

describe('when not on the /selection route', () => {
  test('the drawer is closed', () => {
    render(<SelectionDrawer modernCoords={[]} maokunCoords={[]} onReset={jest.fn()} />);
    expect(screen.queryByText('Code')).toBeNull();
  });
});
