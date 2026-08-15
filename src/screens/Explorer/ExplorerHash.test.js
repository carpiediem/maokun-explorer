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

describe('when the URL hash selects a place (e.g. #/place/5)', () => {
  afterEach(() => {
    screen.queryAllByTestId(/-map-section-5$/).forEach((el) => el.remove());
  });

  test("applies the selected class to that place's markers, not just recenters the maps", async () => {
    // The real map components render marker <path> elements outside of Explorer's own React
    // tree structure (they're mocked here), so simulate their presence directly in the DOM the
    // way MaoKunMap/ModernMap normally would.
    document.body.insertAdjacentHTML(
      'beforeend',
      `
        <section class="maokun" data-testid="maokun-map-section-5">
          <path class="circle-marker id-5" data-testid="maokun-marker-5"></path>
        </section>
        <section class="modern" data-testid="modern-map-section-5">
          <path class="circle-marker id-5" data-testid="modern-marker-5"></path>
        </section>
      `,
    );

    const getGeoJson = require('../../util/getGeoJson');
    const readHash = require('../../util/readHash');
    getGeoJson.mockResolvedValue([]);
    readHash.mockReturnValue({ point: 5 });

    render(<Explorer />);

    await waitFor(() => expect(screen.getByTestId('maokun-marker-5')).toHaveClass('selected'));
    expect(screen.getByTestId('modern-marker-5')).toHaveClass('selected');
  });
});
