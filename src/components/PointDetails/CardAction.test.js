import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { intlEnWrapper } from '../../LocaleContext';
import CardAction from './CardAction';

describe('when neither href nor onClick is provided', () => {
  test('renders nothing', () => {
    render(<CardAction messageId="x" defaultMessage="X" icon={<span>icon</span>} />, intlEnWrapper);
    expect(screen.queryByText('icon')).toBeNull();
  });
});

describe('when icon is not provided', () => {
  test('renders nothing', () => {
    render(<CardAction messageId="x" defaultMessage="X" href="https://example.com" />, intlEnWrapper);
    expect(screen.queryByRole('link')).toBeNull();
  });
});

describe('when href is provided', () => {
  test('renders a link with the icon', () => {
    render(
      <CardAction messageId="x" defaultMessage="View X" href="https://example.com" icon={<span>icon</span>} />,
      intlEnWrapper,
    );

    // eslint-disable-next-line testing-library/no-node-access -- finding the enclosing link by its icon text
    const link = screen.getByText('icon').closest('a');
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('title')).toBe('View X');
  });
});

describe('when only onClick is provided', () => {
  test('renders a clickable icon that triggers onClick', () => {
    const onClick = jest.fn();
    render(
      <CardAction messageId="x" defaultMessage="Do X" onClick={onClick} icon={<span>icon</span>} />,
      intlEnWrapper,
    );

    userEvent.click(screen.getByText('icon'));
    expect(onClick).toHaveBeenCalled();
  });
});
