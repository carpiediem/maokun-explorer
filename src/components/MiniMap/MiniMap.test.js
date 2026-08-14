import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { intlEnWrapper } from '../../LocaleContext';
import regions from './regions.json';
import MiniMap from './index';

test('renders a colored rect and label for every region, and the field-of-view rect', () => {
  const fovRef = React.createRef();
  render(<MiniMap fovRef={fovRef} onClick={jest.fn()} />, intlEnWrapper);

  regions.forEach(({ id, name, rects }) => {
    // eslint-disable-next-line testing-library/no-node-access -- svg groups have no accessible role
    const group = document.querySelector(`g#${id}`);
    expect(group).not.toBeNull();
    // eslint-disable-next-line testing-library/no-node-access -- svg rects have no accessible role
    expect(group.querySelectorAll('rect').length).toBe(rects.length);
    expect(screen.getAllByText(name).length).toBeGreaterThan(0);
  });

  // eslint-disable-next-line testing-library/no-node-access -- svg rect has no accessible role
  expect(document.querySelector('rect#bounds')).toBe(fovRef.current);
});

test('clicking the map reports percentage coordinates', () => {
  const onClick = jest.fn();
  render(<MiniMap fovRef={React.createRef()} onClick={onClick} />, intlEnWrapper);

  // eslint-disable-next-line testing-library/no-node-access -- svg root has no accessible role
  fireEvent.click(document.querySelector('svg#mini-map'), { pageX: 100, pageY: 20 });

  expect(onClick).toHaveBeenCalledWith(
    expect.objectContaining({ xRatio: expect.any(Number), yRatio: expect.any(Number) }),
  );
});
