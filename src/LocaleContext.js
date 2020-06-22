import React, { useContext } from "react";
import { IntlProvider } from "react-intl";

export const LocaleContext = React.createContext();
export const useLocaleContext = () => useContext(LocaleContext);

export const LocaleContextProvider = props => {
  const [locale, setLocale] = React.useState("en");
  return (
    <LocaleContext.Provider value={[locale, setLocale]}>
      {props.children}
    </LocaleContext.Provider>
  );
};

export const intlEnWrapper = {
  wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>
};
export const intlZhWrapper = {
  wrapper: ({ children }) => <IntlProvider locale="zh">{children}</IntlProvider>
};
