import React, { useContext } from "react";
import { IntlProvider } from "react-intl";

import getBrowserLocale from "./util/getBrowserLocale";
const messages = { zh: require("./translations/zh") };

export const LocaleContext = React.createContext();
export const useLocaleContext = () => useContext(LocaleContext);

export const LocaleContextProvider = props => {
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
  )
};
export const intlZhWrapper = {
  wrapper: ({ children }) => (
    <IntlProvider locale="zh" messages={messages.zh}>
      {children}
    </IntlProvider>
  )
};
