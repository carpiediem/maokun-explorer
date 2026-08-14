import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import LabeledMarker from './LabeledMarker';

jest.mock('react-leaflet', () => ({
  CircleMarker: ({ onClick, className, children }) => (
    <div data-testid="circle-marker" className={className} onClick={onClick}>
      {children}
    </div>
  ),
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>,
}));

const IDENTIFIED_PROPS = {
  properties: { id: 1, category: 'town', nameEn: 'Kozhikode', nameTc: '古里' },
  geometry: { coordinates: [1, 2], zoomify: [100, 200] },
};

const UNIDENTIFIED_PROPS = {
  properties: { id: 2, category: 'town', nameEn: 'Unknown', nameTc: '' },
  geometry: { coordinates: [], zoomify: [100, 200] },
};

describe('when the point has known coordinates', () => {
  test('does not add the unidentified class', () => {
    render(<LabeledMarker {...IDENTIFIED_PROPS} onSelect={jest.fn()} labeled={false} />, intlEnWrapper);

    const marker = screen.getByTestId('circle-marker');
    expect(marker.className).not.toMatch(/unidentified/);
    expect(marker.className).toMatch(/circle-marker town id-1/);
  });
});

describe('when the point has no known coordinates', () => {
  test('adds the unidentified class', () => {
    render(<LabeledMarker {...UNIDENTIFIED_PROPS} onSelect={jest.fn()} labeled={false} />, intlEnWrapper);

    const marker = screen.getByTestId('circle-marker');
    expect(marker.className).toMatch(/unidentified/);
  });
});

describe('when labeled is false', () => {
  test('renders no tooltip', () => {
    render(<LabeledMarker {...IDENTIFIED_PROPS} onSelect={jest.fn()} labeled={false} />, intlEnWrapper);
    expect(screen.queryByTestId('tooltip')).toBeNull();
  });
});

describe('when labeled is true', () => {
  test('renders the English name in the en locale', () => {
    render(<LabeledMarker {...IDENTIFIED_PROPS} onSelect={jest.fn()} labeled={true} />, intlEnWrapper);
    expect(screen.getByTestId('tooltip')).toHaveTextContent('Kozhikode');
  });

  test('renders the Traditional Chinese name in the zh locale', () => {
    render(<LabeledMarker {...IDENTIFIED_PROPS} onSelect={jest.fn()} labeled={true} />, intlZhWrapper);
    expect(screen.getByTestId('tooltip')).toHaveTextContent('古里');
  });
});

describe('when the marker is clicked', () => {
  test('calls onSelect with the point id', () => {
    const onSelect = jest.fn();
    render(<LabeledMarker {...IDENTIFIED_PROPS} onSelect={onSelect} labeled={false} />, intlEnWrapper);

    userEvent.click(screen.getByTestId('circle-marker'));
    expect(onSelect).toHaveBeenCalledWith(1, 'point', 'maokun');
  });
});
