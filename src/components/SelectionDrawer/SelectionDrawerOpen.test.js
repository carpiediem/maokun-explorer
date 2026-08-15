import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// `isOpen` in index.tsx is computed once, at import time, from document.location.pathname,
// so the route must be set before the module is first required (a plain top-level `import`
// would be hoisted above this and evaluate too early).
window.history.pushState({}, '', '/selection');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SelectionDrawer = require('./index').default;

const MODERN_COORDS = [{ lat: 25.276987, lng: 55.296249 }];
const MAOKUN_COORDS = [[1234, 5678]];

function renderOpen(props = {}) {
  return render(
    <SelectionDrawer modernCoords={MODERN_COORDS} maokunCoords={MAOKUN_COORDS} onReset={jest.fn()} {...props} />,
  );
}

// These MUI TextFields don't wire a matching id/htmlFor between their label and input, so
// getByLabelText can't associate them; find the field by its label's enclosing FormControl instead.
function fieldFor(labelText) {
  const label = screen.getByText(labelText);
  // eslint-disable-next-line testing-library/no-node-access -- see comment above
  return label.closest('.MuiFormControl-root').querySelector('input, textarea');
}

test('renders CSV rows for the Zoomify and geographic coordinates', () => {
  renderOpen();

  expect(fieldFor('Zoomify Coordinates')).toHaveValue('undefined\t1234\t5678\n');
  expect(fieldFor('Geographic Coordinates')).toHaveValue('undefined\t25.276987\t55.296249\n');
});

test('typing a code prefixes each CSV row', () => {
  renderOpen();

  userEvent.type(fieldFor('Code'), 'ABC');

  expect(fieldFor('Zoomify Coordinates')).toHaveValue('ABC\t1234\t5678\n');
  expect(fieldFor('Geographic Coordinates')).toHaveValue('ABC\t25.276987\t55.296249\n');
});

test('clicking Reset calls props.onReset()', () => {
  const onReset = jest.fn();
  renderOpen({ onReset });

  userEvent.click(screen.getByText('Reset'));
  expect(onReset).toHaveBeenCalled();
});
