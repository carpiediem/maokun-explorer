import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import FilterDialog from './FilterDialog';

// jest.mock('./FilterDialog', () => ({ open }) => (
//   <div>{`FilterDialog component: ${open ? '' : 'not '}visible`}</div>
// ));

describe('when props.open is false', () => {
  test('render nothing', () => {
    render(<FilterDialog open={false} />, intlEnWrapper);
    expect(screen.queryByText(/\w/i)).toBeNull();
  });
});

describe('when clicked outside the dialog', () => {
  test('Triggers onClose callback', () => {
    const closeAction = jest.fn();
    render(<FilterDialog open onClose={closeAction} />, intlEnWrapper);

    userEvent.click(screen.getByRole('none'));
    expect(closeAction).toHaveBeenCalled();
  });
});

// test('', () => {});

describe('when en locale is used', () => {
  test('Renders text in English', () => {
    render(<FilterDialog open />, intlEnWrapper);

    expect(screen.getByText('Filter Markers')).toBeInTheDocument();
    expect(screen.getByText('town')).toBeInTheDocument();
    expect(screen.getByText('area')).toBeInTheDocument();
    expect(screen.getByText('building')).toBeInTheDocument();
    expect(screen.getByText('mountain')).toBeInTheDocument();
    expect(screen.getByText('peninsula')).toBeInTheDocument();
    expect(screen.getByText('island')).toBeInTheDocument();
    expect(screen.getByText('water body')).toBeInTheDocument();
    expect(screen.getByText('descriptor')).toBeInTheDocument();
    // expect(screen.getByText('SWITCH ALL ON')).toBeInTheDocument();
  });
});

describe('when zh locale is used', () => {
  test('Renders text in Traditional Chinese', () => {
    render(<FilterDialog open />, intlZhWrapper);

    expect(screen.getByText('選擇疊加類別')).toBeInTheDocument();
    expect(screen.getByText('鎮')).toBeInTheDocument();
    expect(screen.getByText('區')).toBeInTheDocument();
    expect(screen.getByText('建造')).toBeInTheDocument();
    expect(screen.getByText('山')).toBeInTheDocument();
    expect(screen.getByText('半島')).toBeInTheDocument();
    expect(screen.getByText('島')).toBeInTheDocument();
    expect(screen.getByText('水體')).toBeInTheDocument();
    expect(screen.getByText('描述')).toBeInTheDocument();
    // expect(screen.getByText('')).toBeInTheDocument();
  });
});

describe('when a category switch is clicked', () => {
  test('Triggers onChange with the toggled category', () => {
    const changeAction = jest.fn();
    render(<FilterDialog open categories={{ town: false }} onChange={changeAction} />, intlEnWrapper);

    fireEvent.click(screen.getByRole('checkbox', { name: 'town' }));
    expect(changeAction).toHaveBeenCalledWith('categories', 'town', true);
  });
});

describe('when a voyage switch is clicked', () => {
  test('Triggers onChange with the toggled voyage', () => {
    const changeAction = jest.fn();
    render(<FilterDialog open voyages={{ 1: false }} onChange={changeAction} />, intlEnWrapper);

    fireEvent.click(screen.getByRole('checkbox', { name: '1st voyage: 1405-07' }));
    expect(changeAction).toHaveBeenCalledWith('voyages', 1, true);
  });
});

describe('category toggle-all button', () => {
  const ALL_CATEGORIES_ON = {
    town: true,
    area: true,
    building: true,
    mountain: true,
    peninsula: true,
    island: true,
    'water body': true,
    descriptor: true,
  };
  const ALL_VOYAGES_ON = { none: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true };

  test('shows "Switch all off" and triggers onChange(null, false) when all categories are on', () => {
    const changeAction = jest.fn();
    render(<FilterDialog open categories={ALL_CATEGORIES_ON} onChange={changeAction} />, intlEnWrapper);

    userEvent.click(screen.getByText('Switch all off'));
    expect(changeAction).toHaveBeenCalledWith(null, false);
  });

  test('shows "Switch all on" and triggers onChange(null, true) when not all categories are on', () => {
    const changeAction = jest.fn();
    render(
      <FilterDialog open categories={{ town: false }} voyages={ALL_VOYAGES_ON} onChange={changeAction} />,
      intlEnWrapper,
    );

    userEvent.click(screen.getByText('Switch all on'));
    expect(changeAction).toHaveBeenCalledWith(null, true);
  });
});

describe('voyage toggle-all button', () => {
  const ALL_CATEGORIES_ON = {
    town: true,
    area: true,
    building: true,
    mountain: true,
    peninsula: true,
    island: true,
    'water body': true,
    descriptor: true,
  };
  const ALL_VOYAGES_ON = { none: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true };

  test('shows "Switch all off" and triggers onChange("voyages", null, false) when all voyages are on', () => {
    const changeAction = jest.fn();
    render(<FilterDialog open voyages={ALL_VOYAGES_ON} onChange={changeAction} />, intlEnWrapper);

    userEvent.click(screen.getByText('Switch all off'));
    expect(changeAction).toHaveBeenCalledWith('voyages', null, false);
  });

  test('shows "Switch all on" and triggers onChange("voyages", null, true) when not all voyages are on', () => {
    const changeAction = jest.fn();
    render(
      <FilterDialog open categories={ALL_CATEGORIES_ON} voyages={{ 1: false }} onChange={changeAction} />,
      intlEnWrapper,
    );

    userEvent.click(screen.getByText('Switch all on'));
    expect(changeAction).toHaveBeenCalledWith('voyages', null, true);
  });
});

// test('', () => {});
