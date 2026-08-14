import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper } from '../../LocaleContext';
import MaoKunMap from './index';

jest.mock('react-leaflet', () => ({
  Map: require('react').forwardRef(({ children, onClick }, ref) => (
    <div
      data-testid="map"
      ref={ref}
      onClick={() =>
        onClick &&
        onClick({
          originalEvent: { path: [{ className: 'leaflet-container' }] },
          latlng: { lat: 1, lng: 2 },
        })
      }
    >
      {children}
    </div>
  )),
  ZoomControl: () => <div data-testid="zoom-control" />,
  CircleMarker: ({ onClick, className, children }) => (
    <div data-testid="circle-marker" className={className} onClick={onClick}>
      {children}
    </div>
  ),
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>,
  Polyline: ({ onClick, className }) => <div data-testid="polyline" className={className} onClick={onClick} />,
}));

jest.mock('./ZoomifyLayer', () => () => <div data-testid="zoomify-layer" />);

const KNOWN_POINT = {
  type: 'Feature',
  properties: { id: 1, category: 'town', nameEn: 'Kozhikode', nameTc: '古里' },
  geometry: { type: 'Point', coordinates: [1, 2], zoomify: [100, 200] },
};

const UNKNOWN_POINT = {
  type: 'Feature',
  properties: { id: 2, category: 'town', nameEn: 'Unplaced', nameTc: '' },
  geometry: { type: 'Point', coordinates: [], zoomify: [0, 0] },
};

const KNOWN_PATH = {
  type: 'Feature',
  properties: { code: 'wei-1', direction: 'in' },
  geometry: { type: 'LineString', zoomify: [1000, 2000] },
};

const UNKNOWN_PATH = {
  type: 'Feature',
  properties: { code: '', direction: 'in' },
  geometry: { type: 'LineString', zoomify: [] },
};

test('only renders markers/paths that are placed on the Mao Kun map', () => {
  render(
    <MaoKunMap
      places={[KNOWN_POINT, UNKNOWN_POINT]}
      paths={[KNOWN_PATH, UNKNOWN_PATH]}
      labelLocations={false}
      onSelect={jest.fn()}
    />,
    intlEnWrapper,
  );

  expect(screen.getAllByTestId('circle-marker').length).toBe(1);
  expect(screen.getAllByTestId('polyline').length).toBe(1);
  expect(screen.getByTestId('polyline').className).toBe('path in code-wei-1');
});

test('renders the zoomify tile layer and zoom control', () => {
  render(<MaoKunMap places={[]} paths={[]} labelLocations={false} onSelect={jest.fn()} />, intlEnWrapper);

  expect(screen.getByTestId('zoomify-layer')).toBeInTheDocument();
  expect(screen.getByTestId('zoom-control')).toBeInTheDocument();
});

test('clicking a marker selects the point', () => {
  const onSelect = jest.fn();
  render(<MaoKunMap places={[KNOWN_POINT]} paths={[]} labelLocations={false} onSelect={onSelect} />, intlEnWrapper);

  userEvent.click(screen.getByTestId('circle-marker'));
  expect(onSelect).toHaveBeenCalledWith(1, 'point', 'maokun');
});

test('clicking a path selects the path', () => {
  const onSelect = jest.fn();
  render(<MaoKunMap places={[]} paths={[KNOWN_PATH]} labelLocations={false} onSelect={onSelect} />, intlEnWrapper);

  userEvent.click(screen.getByTestId('polyline'));
  expect(onSelect).toHaveBeenCalledWith('wei-1', 'path', 'maokun');
});

test('clicking the base map deselects', () => {
  const onSelect = jest.fn();
  const onClick = jest.fn();
  render(
    <MaoKunMap places={[]} paths={[]} labelLocations={false} onSelect={onSelect} onClick={onClick} />,
    intlEnWrapper,
  );

  userEvent.click(screen.getByTestId('map'));

  expect(onClick).toHaveBeenCalledWith({ lat: 1, lng: 2 });
  expect(onSelect).toHaveBeenCalledWith(null);
});
