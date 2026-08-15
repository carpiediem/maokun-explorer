import React from 'react';
import { render } from '@testing-library/react';

import drawGlobe from './drawGlobe';
import drawGraticule from './drawGraticule';
import Globe from './index';

jest.mock('./drawGlobe', () => jest.fn());
jest.mock('./drawGraticule', () => jest.fn());

beforeEach(() => {
  drawGlobe.mockClear();
  drawGraticule.mockClear();
});

test('draws the graticule and the globe on mount', () => {
  render(<Globe />);

  expect(drawGraticule).toHaveBeenCalledTimes(1);
  expect(drawGlobe).toHaveBeenCalledTimes(1);
});

test('renders the SVG structure the drawing functions target', () => {
  render(<Globe />);

  // eslint-disable-next-line testing-library/no-node-access -- svg has no accessible role by default
  const svg = document.querySelector('svg#globe');
  expect(svg).not.toBeNull();
  // eslint-disable-next-line testing-library/no-node-access -- svg groups have no accessible role
  expect(svg.querySelector('g.graticule')).not.toBeNull();
  // eslint-disable-next-line testing-library/no-node-access -- svg groups have no accessible role
  expect(svg.querySelector('g.countries')).not.toBeNull();
  // eslint-disable-next-line testing-library/no-node-access -- svg groups have no accessible role
  expect(svg.querySelector('g.provinces')).not.toBeNull();
  // eslint-disable-next-line testing-library/no-node-access -- svg groups have no accessible role
  expect(svg.querySelector('path.field-of-view')).not.toBeNull();
});

test('forwards fovRef to the field-of-view path', () => {
  const fovRef = React.createRef();
  render(<Globe fovRef={fovRef} />);

  // eslint-disable-next-line testing-library/no-node-access -- svg has no accessible role by default
  expect(fovRef.current).toBe(document.querySelector('path.field-of-view'));
});
