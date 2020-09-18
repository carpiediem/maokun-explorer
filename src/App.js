import React from 'react';
import { IntlProvider } from 'react-intl';
// import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import { createBrowserHistory } from 'history';

import Explorer from './screens/Explorer';

import './App.css';

import { LocaleContext } from './LocaleContext';
const messages = {
  en: require('./translations/en'),
  zh: require('./translations/zh'),
};

function App() {
  const [locale] = React.useContext(LocaleContext);
  // const history = createBrowserHistory();

  // history.listen((location) => {
  //   window.gtag('set', 'page', location.pathname + location.search);
  //   window.gtag('send', 'pageview');
  // });

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {/* <BrowserRouter history={history}>
        <Switch>
          <Route path="/"> */}
      <Explorer />
      {/* </Route>
        </Switch>
      </BrowserRouter> */}
    </IntlProvider>
  );
}

export default App;
