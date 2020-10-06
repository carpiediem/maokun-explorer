import React from 'react';
import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

// import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import ColoredSwitch from './ColoredSwitch';

test('renders grey, by default', () => {
  const { container } = render(<ColoredSwitch />);
  expect(container.firstElementChild.getAttribute('class')).toBe(
    'MuiSwitch-root'
  );
  expect(
    getComputedStyle(container.querySelector('.MuiSwitch-switchBase')).color
  ).toBe('rgba(0, 0, 0, 0.54)');
  expect(
    getComputedStyle(container.querySelector('.MuiSwitch-track')).opacity
  ).toBe('0.38');
});

// test('renders in specified hex color', () => {
//   const HEX_COLOR = '#bf5b17';
//   const { container } = render(<ColoredSwitch color={HEX_COLOR} />);
//   expect(container.firstElementChild.getAttribute('class')).toBe(
//     'MuiSwitch-root'
//   );
//   expect(
//     getComputedStyle(container.querySelector('.MuiSwitch-switchBase')).color
//   ).toBe(HEX_COLOR);
//   expect(
//     getComputedStyle(container.querySelector('.MuiSwitch-track'))
//       .backgroundColor
//   ).toBe(HEX_COLOR);
// });

// test('', () => {});
