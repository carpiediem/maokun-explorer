import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toDataURL } from 'qrcode';

import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import PathDetails from './index';

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

beforeEach(() => {
  toDataURL.mockResolvedValue('data:image/png;base64,mock');
});

const WITH_MILLS = {
  type: 'Feature',
  properties: {
    code: 'path-1',
    name: 'Kozhikode to Hormuz',
    nameTc: '古里到忽魯謨斯',
    direction: 'in',
    textHtml: '<li>original text</li>',
    translationHtml: '<li>translation</li>',
    millsTranslation: "Mills' account of the voyage.",
  },
};

const WITHOUT_MILLS_OR_DIRECTION = {
  type: 'Feature',
  properties: {
    code: 'path-2',
    name: 'Hormuz to Malindi',
    nameTc: '忽魯謨斯到麻林地',
    direction: undefined,
    textHtml: '<li>other text</li>',
    translationHtml: '<li>other translation</li>',
    millsTranslation: '',
  },
};

const PATHS = [WITH_MILLS, WITHOUT_MILLS_OR_DIRECTION];

describe('when props.paths is empty', () => {
  test('renders nothing', () => {
    render(<PathDetails paths={[]} id="path-1" onSelect={jest.fn()} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when props.id does not match any path', () => {
  test('renders nothing', () => {
    render(<PathDetails paths={PATHS} id={null} onSelect={jest.fn()} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when a path is selected', () => {
  test('renders the direction chip, text, and translation', async () => {
    render(<PathDetails paths={PATHS} id="path-1" onSelect={jest.fn()} />, intlEnWrapper);

    expect(screen.getByText('Kozhikode to Hormuz')).toBeInTheDocument();
    expect(screen.getByText('inbound, to China')).toBeInTheDocument();
    expect(screen.getByText('original text')).toBeInTheDocument();
    expect(screen.getByText('translation')).toBeInTheDocument();
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
  });

  test("renders J.V.G. Mills' translation when present", async () => {
    render(<PathDetails paths={PATHS} id="path-1" onSelect={jest.fn()} />, intlEnWrapper);

    expect(screen.getByText("J.V.G. Mills' Translation")).toBeInTheDocument();
    expect(screen.getByText("Mills' account of the voyage.")).toBeInTheDocument();
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
  });

  test('omits the direction chip and Mills accordion when absent', async () => {
    render(<PathDetails paths={PATHS} id="path-2" onSelect={jest.fn()} />, intlEnWrapper);

    expect(screen.queryByText('inbound, to China')).toBeNull();
    expect(screen.queryByText('outbound, from China')).toBeNull();
    expect(screen.queryByText("J.V.G. Mills' Translation")).toBeNull();
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
  });

  test('closing the drawer (e.g. via Escape) calls props.onSelect()', async () => {
    const onSelect = jest.fn();
    render(<PathDetails paths={PATHS} id="path-1" onSelect={onSelect} />, intlEnWrapper);
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());

    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape', code: 'Escape' });

    expect(onSelect).toHaveBeenCalledWith();
  });
});

describe('when the locale is zh', () => {
  test('renders the Traditional Chinese name', async () => {
    render(<PathDetails paths={PATHS} id="path-1" onSelect={jest.fn()} />, intlZhWrapper);
    expect(screen.getByText('古里到忽魯謨斯')).toBeInTheDocument();
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
  });
});

describe('when props.outlinksDisabled is false', () => {
  test('renders a direct share link', async () => {
    render(<PathDetails paths={PATHS} id="path-1" outlinksDisabled={false} onSelect={jest.fn()} />, intlEnWrapper);

    // eslint-disable-next-line testing-library/no-node-access -- matching link by href, not accessible content
    const shareLink = document.querySelector('a[href="#/path/path-1"]');
    expect(shareLink).not.toBeNull();
    await waitFor(() => expect(toDataURL).toHaveBeenCalled());
  });
});

describe('when props.outlinksDisabled is true', () => {
  test('clicking the share button reveals a QR code instead of linking out', async () => {
    render(<PathDetails paths={PATHS} id="path-1" outlinksDisabled={true} onSelect={jest.fn()} />, intlEnWrapper);

    // eslint-disable-next-line testing-library/no-node-access -- matching link by href, not accessible content
    expect(document.querySelector('a[href="#/path/path-1"]')).toBeNull();
    expect(screen.queryByAltText('QR code of the URL for this path')).toBeNull();

    userEvent.click(screen.getAllByRole('button')[0]);

    await waitFor(() => {
      expect(screen.getByAltText('QR code of the URL for this path')).toBeInTheDocument();
    });
  });
});
