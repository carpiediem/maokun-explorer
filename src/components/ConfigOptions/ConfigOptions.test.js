import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import ConfigOptions from './index';

jest.mock('./LanguageDialog', () => ({ open }) => `LanguageDialog component: ${open ? '' : 'not '}visible`);
jest.mock('./FilterDialog', () => ({ open }) => `FilterDialog component: ${open ? '' : 'not '}visible`);

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
  render(<ConfigOptions />, intlEnWrapper);
  expect(screen.getByText('LanguageDialog component: not visible')).toBeInTheDocument();
  expect(screen.getByText('FilterDialog component: not visible')).toBeInTheDocument();
});

test('Renders five configuration options and a subheader', () => {
  render(<ConfigOptions />, intlEnWrapper);
  // id="nested-list-subheader"
  const buttons = screen.getAllByRole('button');
  expect(buttons.length).toBe(5);
});

describe('when toggle buttons are clicked', () => {
  test('Triggers onChange callback', () => {
    const changeAction = jest.fn();
    render(<ConfigOptions onChange={changeAction} syncMaps />, intlEnWrapper);
    expect(changeAction).toHaveBeenCalledTimes(0);

    userEvent.click(screen.getByText('Lock Map Sizes'));
    expect(changeAction).toHaveBeenCalledWith('lockPanes', true);
    userEvent.click(screen.getByText('Sync Map Views'));
    expect(changeAction).toHaveBeenCalledWith('syncMaps', false);
    userEvent.click(screen.getByText('Show Place Names'));
    expect(changeAction).toHaveBeenCalledWith('labelLocations', true);

    expect(changeAction).toHaveBeenCalledTimes(3);
  });
});

describe('when submenu buttons are clicked', () => {
  test('Displays dialog components', () => {
    render(<ConfigOptions />, intlEnWrapper);

    userEvent.click(screen.getByText('Language'));
    expect(screen.getByText('LanguageDialog component: visible')).toBeInTheDocument();

    userEvent.click(screen.getByText('Filter Markers'));
    expect(screen.getByText('FilterDialog component: visible')).toBeInTheDocument();
  });
});

describe('when en locale is used', () => {
  test('Renders text in English', () => {
    render(<ConfigOptions syncMaps categories={ALL_CATEGORIES_FIXTURE} />, intlEnWrapper);
    const subheader = screen.getByText('Preferences');
    const languageLabel = screen.getByText('Language');
    const languageValue = screen.getByText('English');
    const panelSizeLabel = screen.getByText('Lock Map Sizes');
    const panelSizeValue = screen.getByText('Draggable');
    const syncLabel = screen.getByText('Sync Map Views');
    const syncValue = screen.getByText('Synced');
    const overlayLabel = screen.getByText('Filter Markers');
    const overlayValue = screen.getByText('all categories; all voyages');
    const labelLabel = screen.getByText('Show Place Names');
    const labelValue = screen.getByText('Labels are hidden');

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
    render(<ConfigOptions syncMaps categories={ALL_CATEGORIES_FIXTURE} />, intlZhWrapper);
    const subheader = screen.getByText('優先');
    const languageLabel = screen.getByText('語言');
    const languageValue = screen.getByText('繁體版');
    const panelSizeLabel = screen.getByText('鎖定地圖大小');
    const panelSizeValue = screen.getByText('可拖動的');
    const syncLabel = screen.getByText('同步地圖');
    const syncValue = screen.getByText('已同步');
    const overlayLabel = screen.getByText('顯示覆蓋');
    // const overlayValue = screen.getByText('鎮，區，建造，山，半島，島，水體，描述'); // all categories; all voyages
    const labelLabel = screen.getByText('標籤位置');
    const labelValue = screen.getByText('標籤被隱藏');

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
