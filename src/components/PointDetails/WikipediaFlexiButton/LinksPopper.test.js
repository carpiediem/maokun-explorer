import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LinksPopper from './LinksPopper';

let mockPlacement = 'bottom';

jest.mock('@material-ui/core/Popper', () => (props) => {
  if (!props.open) return null;
  return props.children({ TransitionProps: {}, placement: mockPlacement });
});

const OPTIONS = [
  { text: 'English Wikipedia', href: 'https://en.wikipedia.org/wiki/Foo' },
  { text: '中文維基百科', href: 'https://zh.wikipedia.org/wiki/Foo' },
];

function Wrapper({ open, setOpen }) {
  const anchorRef = React.useRef(null);
  return (
    <div>
      <button ref={anchorRef}>anchor</button>
      <LinksPopper anchorRef={anchorRef} open={open} setOpen={setOpen} options={OPTIONS} />
    </div>
  );
}

beforeEach(() => {
  mockPlacement = 'bottom';
});

describe('when closed', () => {
  test('renders nothing', () => {
    render(<Wrapper open={false} setOpen={jest.fn()} />);
    expect(screen.queryByText('English Wikipedia')).toBeNull();
  });
});

describe('when open', () => {
  test('renders a menu item per option', () => {
    render(<Wrapper open={true} setOpen={jest.fn()} />);

    // eslint-disable-next-line testing-library/no-node-access -- finding the enclosing link by its text
    const enLink = screen.getByText('English Wikipedia').closest('a');
    expect(enLink.getAttribute('href')).toBe('https://en.wikipedia.org/wiki/Foo');
    expect(screen.getByText('中文維基百科')).toBeInTheDocument();
  });

  test('placement "bottom" transforms from the top', () => {
    mockPlacement = 'bottom';
    render(<Wrapper open={true} setOpen={jest.fn()} />);

    // eslint-disable-next-line testing-library/no-node-access -- transformOrigin isn't exposed via an accessible query
    const paper = document.querySelector('.MuiPaper-root');
    expect(paper.style.transformOrigin).toBe('center top');
  });

  test('any other placement transforms from the bottom', () => {
    mockPlacement = 'top';
    render(<Wrapper open={true} setOpen={jest.fn()} />);

    // eslint-disable-next-line testing-library/no-node-access -- transformOrigin isn't exposed via an accessible query
    const paper = document.querySelector('.MuiPaper-root');
    expect(paper.style.transformOrigin).toBe('center bottom');
  });

  test('clicking the anchor does not close the menu', async () => {
    const setOpen = jest.fn();
    render(<Wrapper open={true} setOpen={setOpen} />);
    // ClickAwayListener defers activation by a tick to avoid reacting to the click that opened it.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    userEvent.click(screen.getByText('anchor'));
    expect(setOpen).not.toHaveBeenCalled();
  });

  test('clicking away closes the menu', async () => {
    const setOpen = jest.fn();
    render(<Wrapper open={true} setOpen={setOpen} />);
    // ClickAwayListener defers activation by a tick to avoid reacting to the click that opened it.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    userEvent.click(document.body);
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
