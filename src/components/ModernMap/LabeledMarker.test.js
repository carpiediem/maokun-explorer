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

const ON_MAOKUN_PROPS = {
  properties: { id: 42, category: 'town', nameEn: 'Kozhikode', nameTc: '古里' },
  geometry: { coordinates: [75.75, 11.25], zoomify: [100, 200] },
};

const NOT_ON_MAOKUN_PROPS = {
  properties: { id: 43, category: 'town', nameEn: 'Hormuz', nameTc: '忽魯謨斯' },
  geometry: { coordinates: [56.45, 27.15], zoomify: [] },
};

describe('when the point is plotted on the Mao Kun map', () => {
  test('does not add the not-on-mao-kun class', () => {
    render(<LabeledMarker {...ON_MAOKUN_PROPS} onSelect={jest.fn()} labeled={false} />, intlEnWrapper);

    const marker = screen.getByTestId('circle-marker');
    expect(marker.className).not.toMatch(/not-on-mao-kun/);
    expect(marker.className).toMatch(/circle-marker town id-42/);
  });
});

describe('when the point is not plotted on the Mao Kun map', () => {
  test('adds the not-on-mao-kun class', () => {
    render(<LabeledMarker {...NOT_ON_MAOKUN_PROPS} onSelect={jest.fn()} labeled={false} />, intlEnWrapper);

    const marker = screen.getByTestId('circle-marker');
    expect(marker.className).toMatch(/not-on-mao-kun/);
  });
});

describe('when labeled is false', () => {
  test('renders no tooltip', () => {
    render(<LabeledMarker {...ON_MAOKUN_PROPS} onSelect={jest.fn()} labeled={false} />, intlEnWrapper);
    expect(screen.queryByTestId('tooltip')).toBeNull();
  });
});

describe('when labeled is true', () => {
  test('renders the English name in the en locale', () => {
    render(<LabeledMarker {...ON_MAOKUN_PROPS} onSelect={jest.fn()} labeled={true} />, intlEnWrapper);
    expect(screen.getByTestId('tooltip')).toHaveTextContent('Kozhikode');
  });

  test('renders the Traditional Chinese name in the zh locale', () => {
    render(<LabeledMarker {...ON_MAOKUN_PROPS} onSelect={jest.fn()} labeled={true} />, intlZhWrapper);
    expect(screen.getByTestId('tooltip')).toHaveTextContent('古里');
  });
});

describe('when the marker is clicked', () => {
  test('calls onSelect with the point id', () => {
    const onSelect = jest.fn();
    render(<LabeledMarker {...ON_MAOKUN_PROPS} onSelect={onSelect} labeled={false} />, intlEnWrapper);

    userEvent.click(screen.getByTestId('circle-marker'));
    expect(onSelect).toHaveBeenCalledWith(42, 'point', 'modern');
  });
});
