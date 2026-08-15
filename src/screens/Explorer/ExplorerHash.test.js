import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// `hashMatch` in index.jsx is computed once, at import time, from window.location.hash, so the
// hash must be set before the module is first required (a plain top-level `import` would be
// hoisted above this and evaluate too early).
window.location.hash = '#/about';

jest.mock('../../util/getGeoJson', () => jest.fn(() => Promise.resolve([])));
jest.mock('../../util/readHash', () => jest.fn(() => ({})));

jest.mock('react-split-pane', () => (props) => (
  <div className={`SplitPane ${props.className || ''}`}>
    <div className="Pane1">{props.children[0]}</div>
    <div className="Pane2">{props.children[1]}</div>
  </div>
));

jest.mock('../../components/Globe', () => () => <div data-testid="globe" />);
jest.mock('../../components/MaoKunMap', () => require('react').forwardRef(() => <div data-testid="maokun-map" />));
jest.mock('../../components/ModernMap', () => require('react').forwardRef(() => <div data-testid="modern-map" />));
jest.mock('../../components/MiniMap', () => () => <div data-testid="mini-map" />);
jest.mock('../../components/IntroDialog', () => (props) => (props.open ? <div data-testid="intro-dialog" /> : null));
jest.mock('../../components/AboutDialog', () => (props) => (props.open ? <div data-testid="about-dialog" /> : null));
jest.mock('../../components/LegendDialog', () => () => null);
jest.mock('../../components/GlossaryDialog', () => () => null);
jest.mock('../../components/NavigationDialog', () => () => null);
jest.mock('../../components/Menu', () => () => <div data-testid="menu" />);
jest.mock('../../components/PointDetails', () => () => <div data-testid="point-details" />);
jest.mock('../../components/PathDetails', () => () => <div data-testid="path-details" />);
jest.mock('../../components/SelectionDrawer', () => () => <div data-testid="selection-drawer" />);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Explorer = require('./index').default;

afterAll(() => {
  window.location.hash = '';
});

test('opens the dialog named in the URL hash instead of the intro dialog', async () => {
  // CRA's jest config resets mock implementations before every test, so the factory-provided
  // default above doesn't stick around; re-establish it here.
  const getGeoJson = require('../../util/getGeoJson');
  const readHash = require('../../util/readHash');
  getGeoJson.mockResolvedValue([]);
  readHash.mockReturnValue({});

  render(<Explorer />);

  expect(screen.getByTestId('about-dialog')).toBeInTheDocument();
  expect(screen.queryByTestId('intro-dialog')).toBeNull();
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());
});
