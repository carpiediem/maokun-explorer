import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Explorer from './index';
import getGeoJson from '../../util/getGeoJson';
import readHash from '../../util/readHash';

jest.mock('../../util/getGeoJson', () => jest.fn());
jest.mock('../../util/readHash', () => jest.fn(() => ({})));

jest.mock('react-split-pane', () => (props) => (
  <div className={`SplitPane ${props.className || ''}`}>
    <div className="Pane1">{props.children[0]}</div>
    <div className="Pane2">{props.children[1]}</div>
    <button onClick={() => props.onChange(999)}>split-pane-resize</button>
  </div>
));

jest.mock('../../components/Globe', () => () => <div data-testid="globe" />);

jest.mock('../../components/MaoKunMap', () =>
  require('react').forwardRef((props, ref) => {
    require('react').useImperativeHandle(ref, () => ({
      leafletElement: { flyToBounds: jest.fn(), fitBounds: jest.fn() },
    }));
    return (
      <div data-testid="maokun-map">
        <button onClick={() => props.onSelect(1, 'point', 'maokun')}>maokun-select</button>
        <button onClick={() => props.onClick({ lat: 1, lng: 2 })}>maokun-click</button>
        <button onClick={() => props.onViewChange({ _southWest: { lng: 0, lat: 0 }, _northEast: { lng: 0, lat: 0 } })}>
          maokun-view
        </button>
      </div>
    );
  }),
);

jest.mock('../../components/ModernMap', () =>
  require('react').forwardRef((props, ref) => {
    require('react').useImperativeHandle(ref, () => ({
      leafletElement: { flyToBounds: jest.fn(), fitBounds: jest.fn() },
    }));
    return (
      <div data-testid="modern-map">
        <button onClick={() => props.onSelect(2, 'point', 'modern')}>modern-select</button>
        <button onClick={() => props.onClick({ lat: 3, lng: 4 })}>modern-click</button>
        <button
          onClick={() => props.onViewChange({ target: { getBounds: () => ({ _southWest: {}, _northEast: {} }) } })}
        >
          modern-view
        </button>
      </div>
    );
  }),
);

jest.mock('../../components/MiniMap', () => (props) => (
  <div data-testid="mini-map">
    <svg>
      <rect ref={props.fovRef} />
    </svg>
    <button onClick={() => props.onClick({ xRatio: 0.5, yRatio: 0.5 })}>minimap-click</button>
  </div>
));

jest.mock(
  '../../components/IntroDialog',
  () => (props) =>
    props.open ? (
      <div data-testid="intro-dialog">
        <button onClick={props.handleClose}>close-intro</button>
      </div>
    ) : null,
);

jest.mock(
  '../../components/AboutDialog',
  () => (props) =>
    props.open ? (
      <div data-testid="about-dialog">
        <button onClick={props.handleClose}>close-about</button>
      </div>
    ) : null,
);

jest.mock(
  '../../components/LegendDialog',
  () => (props) =>
    props.open ? (
      <div data-testid="legend-dialog">
        <button onClick={props.handleClose}>close-legend</button>
      </div>
    ) : null,
);

jest.mock(
  '../../components/GlossaryDialog',
  () => (props) =>
    props.open ? (
      <div data-testid="glossary-dialog">
        <button onClick={props.handleClose}>close-glossary</button>
      </div>
    ) : null,
);

jest.mock(
  '../../components/NavigationDialog',
  () => (props) =>
    props.open ? (
      <div data-testid="navigation-dialog">
        <button onClick={props.handleClose}>close-navigation</button>
      </div>
    ) : null,
);

jest.mock('../../components/Menu', () => (props) => (
  <div data-testid="menu">
    <button onClick={() => props.onChange('lockPanes', true)}>toggle-lock-panes</button>
    <button onClick={() => props.setDialog('about')}>open-about</button>
    <button onClick={() => props.setDialog('legend')}>open-legend</button>
    <button onClick={() => props.setDialog('glossary')}>open-glossary</button>
    <button onClick={() => props.setDialog('navigation')}>open-navigation</button>
  </div>
));

jest.mock('../../components/PointDetails', () => (props) => (
  <div data-testid="point-details">{props.id != null && <span>point-{props.id}</span>}</div>
));

jest.mock('../../components/PathDetails', () => (props) => (
  <div data-testid="path-details">{props.id != null && <span>path-{props.id}</span>}</div>
));

jest.mock('../../components/SelectionDrawer', () => (props) => (
  <div data-testid="selection-drawer">
    <button onClick={props.onReset}>reset-selection</button>
  </div>
));

const FIXTURE_PLACES = [
  { properties: { id: 1, category: 'town', voyages: [] }, geometry: { coordinates: [1, 2], zoomify: [10, 20] } },
  { properties: { id: 2, category: 'town', voyages: [] }, geometry: { coordinates: [3, 4], zoomify: [30, 40] } },
  { properties: { id: 5, category: 'town', voyages: [] }, geometry: { coordinates: [5, 6], zoomify: [50, 60] } },
];

const FIXTURE_PATHS = [
  {
    properties: { code: 'wei-1', direction: 'in', landmarks: [1] },
    geometry: { coordinates: [], zoomify: [] },
  },
];

beforeEach(() => {
  global.gtag = jest.fn();
  localStorage.clear();
  // CRA's jest config resets mock implementations before every test, so the factory-provided
  // defaults above don't stick around; re-establish them here.
  getGeoJson.mockImplementation((url) =>
    url.includes('places') ? Promise.resolve(FIXTURE_PLACES) : Promise.resolve(FIXTURE_PATHS),
  );
  readHash.mockReturnValue({});
});

afterEach(() => {
  delete global.gtag;
});

test('starts on the intro dialog and loads places/paths data', async () => {
  render(<Explorer />);

  expect(screen.getByTestId('intro-dialog')).toBeInTheDocument();
  await waitFor(() => expect(getGeoJson).toHaveBeenCalledWith('data/maokun-places.geo.json'));
  expect(getGeoJson).toHaveBeenCalledWith('data/maokun-paths.geo.json');
});

test('closing the intro dialog re-centers both maps', async () => {
  render(<Explorer />);
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

  userEvent.click(screen.getByText('close-intro'));

  expect(screen.queryByTestId('intro-dialog')).toBeNull();
});

describe('menu-driven dialogs', () => {
  test.each([
    ['open-about', 'about-dialog', 'close-about'],
    ['open-legend', 'legend-dialog', 'close-legend'],
    ['open-glossary', 'glossary-dialog', 'close-glossary'],
    ['open-navigation', 'navigation-dialog', 'close-navigation'],
  ])('%s opens and %s closes the dialog', async (openButton, testId, closeButton) => {
    render(<Explorer />);
    await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

    userEvent.click(screen.getByText(openButton));
    expect(screen.getByTestId(testId)).toBeInTheDocument();

    userEvent.click(screen.getByText(closeButton));
    expect(screen.queryByTestId(testId)).toBeNull();
  });
});

test('changing a preference (e.g. locking panes) is reflected in the split pane class', async () => {
  render(<Explorer />);
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

  userEvent.click(screen.getByText('toggle-lock-panes'));

  // eslint-disable-next-line testing-library/no-node-access -- the split pane has no accessible role
  expect(document.querySelector('.SplitPane')).toHaveClass('locked');
});

test('selecting a point on the Mao Kun map updates PointDetails and flies the ModernMap', async () => {
  render(<Explorer />);
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

  userEvent.click(screen.getByText('maokun-select'));

  expect(screen.getByText('point-1')).toBeInTheDocument();
});

test('clicking the Mao Kun map records a Zoomify-coordinate selection point', async () => {
  render(<Explorer />);
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

  userEvent.click(screen.getByText('maokun-click'));
  userEvent.click(screen.getByText('reset-selection'));

  expect(screen.getByTestId('selection-drawer')).toBeInTheDocument();
});

test('clicking the modern map records a lat/lng selection point', async () => {
  render(<Explorer />);
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

  expect(() => userEvent.click(screen.getByText('modern-click'))).not.toThrow();
});

test('view changes from either map update the field-of-view indicators', async () => {
  render(<Explorer />);
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

  expect(() => userEvent.click(screen.getByText('maokun-view'))).not.toThrow();
  expect(() => userEvent.click(screen.getByText('modern-view'))).not.toThrow();
});

test('clicking the MiniMap deselects and centers the Mao Kun map', async () => {
  render(<Explorer />);
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

  userEvent.click(screen.getByText('maokun-select'));
  expect(screen.getByText('point-1')).toBeInTheDocument();

  userEvent.click(screen.getByText('minimap-click'));

  expect(screen.queryByText('point-1')).toBeNull();
});

describe('when the URL hash selects a point or path on load', () => {
  test('renders the details for the pre-selected item', async () => {
    readHash.mockReturnValue({ point: 5 });

    render(<Explorer />);

    expect(await screen.findByText('point-5')).toBeInTheDocument();
  });
});

describe('when a splitPos was previously stored', () => {
  test('uses the stored size instead of the window height', async () => {
    localStorage.setItem('splitPos', '400');

    render(<Explorer />);
    await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

    // eslint-disable-next-line testing-library/no-node-access -- the split pane has no accessible role
    expect(document.querySelector('.Pane1')).toBeInTheDocument();
  });
});

test('dragging the split pane persists the new size to localStorage', async () => {
  render(<Explorer />);
  await waitFor(() => expect(getGeoJson).toHaveBeenCalled());

  userEvent.click(screen.getByText('split-pane-resize'));

  expect(localStorage.getItem('splitPos')).toBe('999');
});
