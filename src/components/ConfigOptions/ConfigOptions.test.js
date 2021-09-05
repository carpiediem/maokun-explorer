import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import ConfigOptions from './index';

jest.mock('./LanguageDialog', () => ({ open }) => (
  <div>{`LanguageDialog component: ${open ? '' : 'not '}visible`}</div>
));
jest.mock('./FilterDialog', () => ({ open }) => <div>{`FilterDialog component: ${open ? '' : 'not '}visible`}</div>);

const ALL_CATEGORIES_FIXTURE = {
  town: true,
  area: true,
  building: true,
  mountain: true,
  peninsula: true,
  island: true,
  'water body': true,
  descriptor: true,
};

test('Initially hides dialogs', () => {
  const { getByText } = render(<ConfigOptions />, intlEnWrapper);
  expect(getByText('LanguageDialog component: not visible')).toBeInTheDocument();
  expect(getByText('FilterDialog component: not visible')).toBeInTheDocument();
});

test('Renders five configuration options and a subheader', () => {
  const { getAllByRole } = render(<ConfigOptions />, intlEnWrapper);
  // id="nested-list-subheader"
  const buttons = getAllByRole('button');
  expect(buttons.length).toBe(5);
});

describe('when toggle buttons are clicked', () => {
  test('Triggers onChange callback', () => {
    const changeAction = jest.fn();
    const { getByText } = render(<ConfigOptions onChange={changeAction} syncMaps />, intlEnWrapper);
    expect(changeAction).toHaveBeenCalledTimes(0);

    userEvent.click(getByText('Lock Map Sizes'));
    expect(changeAction).toHaveBeenCalledWith('lockPanes', true);
    userEvent.click(getByText('Sync Map Views'));
    expect(changeAction).toHaveBeenCalledWith('syncMaps', false);
    userEvent.click(getByText('Show Place Names'));
    expect(changeAction).toHaveBeenCalledWith('labelLocations', true);

    expect(changeAction).toHaveBeenCalledTimes(3);
  });
});

describe('when submenu buttons are clicked', () => {
  test('Displays dialog components', () => {
    const { getByText } = render(<ConfigOptions />, intlEnWrapper);

    userEvent.click(getByText('Language'));
    expect(getByText('LanguageDialog component: visible')).toBeInTheDocument();

    userEvent.click(getByText('Filter Markers'));
    expect(getByText('FilterDialog component: visible')).toBeInTheDocument();
  });
});

describe('when en locale is used', () => {
  test('Renders text in English', () => {
    const { getByText } = render(<ConfigOptions syncMaps categories={ALL_CATEGORIES_FIXTURE} />, intlEnWrapper);
    const subheader = getByText('Preferences');
    const languageLabel = getByText('Language');
    const languageValue = getByText('English');
    const panelSizeLabel = getByText('Lock Map Sizes');
    const panelSizeValue = getByText('Draggable');
    const syncLabel = getByText('Sync Map Views');
    const syncValue = getByText('Synced');
    const overlayLabel = getByText('Filter Markers');
    const overlayValue = getByText('all categories; all voyages');
    const labelLabel = getByText('Show Place Names');
    const labelValue = getByText('Labels are hidden');

    expect(subheader).toBeInTheDocument();
    expect(languageLabel).toBeInTheDocument();
    expect(languageValue).toBeInTheDocument();
    expect(panelSizeLabel).toBeInTheDocument();
    expect(panelSizeValue).toBeInTheDocument();
    expect(syncLabel).toBeInTheDocument();
    expect(syncValue).toBeInTheDocument();
    expect(overlayLabel).toBeInTheDocument();
    expect(overlayValue).toBeInTheDocument();
    expect(labelLabel).toBeInTheDocument();
    expect(labelValue).toBeInTheDocument();
  });
});

describe('when zh locale is used', () => {
  test('Renders text in Traditional Chinese', () => {
    const { getByText } = render(<ConfigOptions syncMaps categories={ALL_CATEGORIES_FIXTURE} />, intlZhWrapper);
    const subheader = getByText('優先');
    const languageLabel = getByText('語言');
    const languageValue = getByText('繁體版');
    const panelSizeLabel = getByText('鎖定地圖大小');
    const panelSizeValue = getByText('可拖動的');
    const syncLabel = getByText('同步地圖');
    const syncValue = getByText('已同步');
    const overlayLabel = getByText('顯示覆蓋');
    // const overlayValue = getByText('鎮，區，建造，山，半島，島，水體，描述'); // all categories; all voyages
    const labelLabel = getByText('標籤位置');
    const labelValue = getByText('標籤被隱藏');

    expect(subheader).toBeInTheDocument();
    expect(languageLabel).toBeInTheDocument();
    expect(languageValue).toBeInTheDocument();
    expect(panelSizeLabel).toBeInTheDocument();
    expect(panelSizeValue).toBeInTheDocument();
    expect(syncLabel).toBeInTheDocument();
    expect(syncValue).toBeInTheDocument();
    expect(overlayLabel).toBeInTheDocument();
    // expect(overlayValue).toBeInTheDocument();
    expect(labelLabel).toBeInTheDocument();
    expect(labelValue).toBeInTheDocument();
  });
});

// test('', () => {});
