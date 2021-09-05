import React from 'react';
// import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LocaleContextProvider } from '../../LocaleContext';
import LanguageDialog from './LanguageDialog';

const enProvidor = (
  <LocaleContextProvider locale="en" messages={require('../../translations/en.json')}></LocaleContextProvider>
);
// const zhProvidor = (
//   <IntlProvider
//     locale="zh"
//     messages={require('../../translations/zh.json')}
//   ></IntlProvider>
// );

describe('when props.open is false', () => {
  test('render nothing', () => {
    const { queryByText } = render(<LanguageDialog open={false} />, enProvidor);
    expect(queryByText(/\w/i)).toBeNull();
  });
});

describe('when clicked outside the dialog', () => {
  test('Triggers onClose callback', () => {
    const closeAction = jest.fn();
    const { getByRole } = render(<LanguageDialog open handleClose={closeAction} />, enProvidor);

    userEvent.click(getByRole('none'));
    expect(closeAction).toHaveBeenCalled();
  });
});

// describe('when option buttons are clicked', () => {
//   test('Changes locale', () => {
//     const { getByText } = render(<LanguageDialog open />, enProvidor);
//     expect(getByText('Choose Language')).toBeInTheDocument();

//     userEvent.click(getByText('繁體版'));
//     expect(getByText('選擇語言')).toBeInTheDocument();
//   });
// });

// describe('when en locale is used', () => {
//   test('Displays options in their own language', () => {
//     const { getByText } = render(<LanguageDialog open />, enProvidor);

//     expect(getByText('Choose Language')).toBeInTheDocument();
//     expect(getByText('English')).toBeInTheDocument();
//     expect(getByText('繁體版')).toBeInTheDocument();
//   });
// });

// describe('when zh locale is used', () => {
//   test('Displays options in their own language', () => {
//     const { getByText } = render(<LanguageDialog open />, zhProvidor);

//     expect(getByText('選擇語言')).toBeInTheDocument();
//     expect(getByText('English')).toBeInTheDocument();
//     expect(getByText('繁體版')).toBeInTheDocument();
//   });
// });
