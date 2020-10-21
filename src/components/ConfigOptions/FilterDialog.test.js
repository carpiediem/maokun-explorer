import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import FilterDialog from './FilterDialog';

// jest.mock('./FilterDialog', () => ({ open }) => (
//   <div>{`FilterDialog component: ${open ? '' : 'not '}visible`}</div>
// ));

describe('when props.open is false', () => {
  test('render nothing', () => {
    const { queryByText } = render(
      <FilterDialog open={false} />,
      intlEnWrapper
    );
    expect(queryByText(/\w/i)).toBeNull();
  });
});

describe('when clicked outside the dialog', () => {
  test('Triggers onClose callback', () => {
    const closeAction = jest.fn();
    const { getByRole } = render(
      <FilterDialog open onClose={closeAction} />,
      intlEnWrapper
    );

    userEvent.click(getByRole('none'));
    expect(closeAction).toHaveBeenCalled();
  });
});

// test('', () => {});

describe('when en locale is used', () => {
  test('Renders text in English', () => {
    const { getByText } = render(<FilterDialog open />, intlEnWrapper);

    expect(getByText('Filter Markers')).toBeInTheDocument();
    expect(getByText('town')).toBeInTheDocument();
    expect(getByText('area')).toBeInTheDocument();
    expect(getByText('building')).toBeInTheDocument();
    expect(getByText('mountain')).toBeInTheDocument();
    expect(getByText('peninsula')).toBeInTheDocument();
    expect(getByText('island')).toBeInTheDocument();
    expect(getByText('water body')).toBeInTheDocument();
    expect(getByText('descriptor')).toBeInTheDocument();
    // expect(getByText('SWITCH ALL ON')).toBeInTheDocument();
  });
});

describe('when zh locale is used', () => {
  test('Renders text in Traditional Chinese', () => {
    const { getByText } = render(<FilterDialog open />, intlZhWrapper);

    expect(getByText('選擇疊加類別')).toBeInTheDocument();
    expect(getByText('鎮')).toBeInTheDocument();
    expect(getByText('區')).toBeInTheDocument();
    expect(getByText('建造')).toBeInTheDocument();
    expect(getByText('山')).toBeInTheDocument();
    expect(getByText('半島')).toBeInTheDocument();
    expect(getByText('島')).toBeInTheDocument();
    expect(getByText('水體')).toBeInTheDocument();
    expect(getByText('描述')).toBeInTheDocument();
    // expect(getByText('')).toBeInTheDocument();
  });
});

// test('', () => {});
