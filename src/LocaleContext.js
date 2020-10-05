import React, { useContext } from 'react';
import { IntlProvider } from 'react-intl';

import getBrowserLocale from './util/getBrowserLocale';
import defaultMessages from './translations/en.json';

const messages = {
  en: defaultMessages,
  zh: Object.assign({}, defaultMessages, require('./translations/zh')),
  oj: Object.assign({}, defaultMessages, {}),
};

export const LocaleContext = React.createContext();
export const useLocaleContext = () => useContext(LocaleContext);

export const LocaleContextProvider = (props) => {
  const [locale, setLocale] = React.useState(getBrowserLocale());
  return (
    <LocaleContext.Provider value={[locale, setLocale]}>
      {props.children}
    </LocaleContext.Provider>
  );
};

export const intlEnWrapper = {
  wrapper: ({ children }) => (
    <IntlProvider locale="en" messages={messages.en}>
      {children}
    </IntlProvider>
  ),
};

export const intlZhWrapper = {
  wrapper: ({ children }) => (
    <IntlProvider locale="zh" messages={messages.zh}>
      {children}
    </IntlProvider>
  ),
};

// For testing default messages in an unsupported language
export const intlOjWrapper = {
  wrapper: ({ children }) => (
    <IntlProvider locale="oj" messages={messages.oj} onError={() => {}}>
      {children}
    </IntlProvider>
  ),
};
