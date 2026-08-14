import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toDataURL } from 'qrcode';

import { intlEnWrapper } from '../../LocaleContext';
import PointDetails from './index';

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

beforeEach(() => {
  toDataURL.mockResolvedValue('data:image/png;base64,mock');
});

const MINIMAL_PLACE = {
  type: 'Feature',
  properties: {
    id: 'place-1',
    label: '古里',
    pinyin: 'Gǔlǐ',
    translation: 'City in India',
    nameEn: 'Kozhikode',
    nameTc: '古里',
    othersEn: 'Calicut',
    othersTc: '卡利卡特',
    region: 'India',
    category: 'town',
    kamalNotes: '',
    voyages: [],
    otherPossibilities: '',
    sourceUrl: 'https://example.com/source',
    wikiEn: 'https://en.wikipedia.org/wiki/Kozhikode',
    wikiZh: '',
  },
  geometry: { coordinates: [] },
};

const FULL_PLACE = {
  type: 'Feature',
  properties: {
    id: 'place-2',
    label: '忽魯謨斯',
    pinyin: 'Hūlǔmósī',
    translation: 'Hormuz',
    nameEn: 'Hormuz',
    nameTc: '忽魯謨斯',
    othersEn: '',
    othersTc: '',
    region: '',
    category: 'town',
    kamalNotes: 'four fingers',
    voyages: [1],
    otherPossibilities: '',
    sourceUrl: 'https://example.com/source-2',
    wikiEn: 'https://en.wikipedia.org/wiki/Hormuz',
    wikiZh: '',
  },
  geometry: { coordinates: [56.45, 27.15], kamalAngle: 4 },
};

const PLACES = [MINIMAL_PLACE, FULL_PLACE];

describe('when props.places is empty', () => {
  test('renders nothing', () => {
    render(<PointDetails places={[]} id="place-1" onSelect={jest.fn()} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when props.id is null', () => {
  test('renders nothing', () => {
    render(<PointDetails places={PLACES} id={null} onSelect={jest.fn()} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when props.id is undefined', () => {
  test('renders nothing', () => {
    render(<PointDetails places={PLACES} id={undefined} onSelect={jest.fn()} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when a place with no extra info or coordinates is selected', () => {
  test('renders the header, category, and modern names, but no map link', async () => {
    render(<PointDetails places={PLACES} id="place-1" onSelect={jest.fn()} />, intlEnWrapper);

    expect(screen.getByText('古里')).toBeInTheDocument();
    expect(screen.getByText('City in India')).toBeInTheDocument();
    expect(screen.getByText('Kozhikode')).toBeInTheDocument();
    expect(screen.getByText('town')).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-node-access -- matching link by href, not accessible content
    expect(document.querySelector('a[href^="https://www.google.com/maps"]')).toBeNull();
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
  });
});

describe('when a place with extra info and coordinates is selected', () => {
  test('renders a Google Maps link built from the coordinates', async () => {
    render(<PointDetails places={PLACES} id="place-2" onSelect={jest.fn()} />, intlEnWrapper);

    // eslint-disable-next-line testing-library/no-node-access -- matching link by href, not accessible content
    const mapLink = document.querySelector('a[href^="https://www.google.com/maps"]');
    expect(mapLink.getAttribute('href')).toBe('https://www.google.com/maps/place/27.15,56.45/@27.15,56.45,12z');
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
  });
});

describe('when props.outlinksDisabled is false', () => {
  test('renders map, reference, wiki, and direct-link actions', async () => {
    render(<PointDetails places={PLACES} id="place-2" outlinksDisabled={false} onSelect={jest.fn()} />, intlEnWrapper);

    // eslint-disable-next-line testing-library/no-node-access -- matching link by href, not accessible content
    expect(document.querySelector('a[href="https://example.com/source-2"]')).not.toBeNull();
    // eslint-disable-next-line testing-library/no-node-access -- matching link by href, not accessible content
    expect(document.querySelector('a[href="https://en.wikipedia.org/wiki/Hormuz"]')).not.toBeNull();
    // eslint-disable-next-line testing-library/no-node-access -- matching link by href, not accessible content
    expect(document.querySelector('a[href="#/place/place-2"]')).not.toBeNull();
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
  });
});

describe('when props.outlinksDisabled is true', () => {
  test('shows a share button that reveals a QR code and then hides the actions', async () => {
    render(<PointDetails places={PLACES} id="place-2" outlinksDisabled={true} onSelect={jest.fn()} />, intlEnWrapper);
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());

    expect(screen.queryByAltText('QR code of the URL for this place')).toBeNull();

    userEvent.click(screen.getByTitle('Share via QR Code'));

    await waitFor(() => {
      expect(screen.getByAltText('QR code of the URL for this place')).toBeInTheDocument();
    });
    expect(screen.queryByTitle('Share via QR Code')).toBeNull();
  });
});

describe('when the drawer is closed', () => {
  test('calls props.onSelect()', async () => {
    const onSelect = jest.fn();
    render(<PointDetails places={PLACES} id="place-1" onSelect={onSelect} />, intlEnWrapper);
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());

    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape', code: 'Escape' });

    expect(onSelect).toHaveBeenCalledWith();
  });
});
