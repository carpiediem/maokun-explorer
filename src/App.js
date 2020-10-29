import React from 'react';
import { IntlProvider } from 'react-intl';

import Explorer from './screens/Explorer';

import './App.css';

import { LocaleContext } from './LocaleContext';
const messages = {
  en: require('./translations/en'),
  zh: require('./translations/zh'),
};

function App() {
  const [locale] = React.useContext(LocaleContext);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Explorer />
    </IntlProvider>
  );
}

export default App;
