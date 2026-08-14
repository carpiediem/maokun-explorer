import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MenuButtons from './MenuButtons';

describe('when closed', () => {
  test('the toggle button has no aria-controls/aria-expanded', () => {
    const setOpen = jest.fn();
    render(<MenuButtons anchorRef={{ current: null }} href="https://example.com" open={false} setOpen={setOpen} />);

    const toggle = screen.getByLabelText('select merge strategy');
    expect(toggle.getAttribute('aria-controls')).toBeNull();
    expect(toggle.getAttribute('aria-expanded')).toBeNull();

    userEvent.click(toggle);
    expect(setOpen).toHaveBeenCalled();
    expect(setOpen.mock.calls[0][0](false)).toBe(true);
  });
});

describe('when open', () => {
  test('the toggle button has aria-controls/aria-expanded set, and the link points to href', () => {
    render(<MenuButtons anchorRef={{ current: null }} href="https://example.com" open={true} setOpen={jest.fn()} />);

    const toggle = screen.getByLabelText('select merge strategy');
    expect(toggle.getAttribute('aria-controls')).toBe('split-button-menu');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('https://example.com');
  });
});
