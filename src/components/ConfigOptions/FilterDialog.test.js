import React from 'react';
import { render, screen } from '@testing-library/react';
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

// test('', () => {});
