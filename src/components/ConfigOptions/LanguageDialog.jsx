import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core';

import { LocaleContext } from '../../LocaleContext';

const LOCALES = {
  en: 'English',
  zh: '繁體版',
  // "zh-cn": "Simplified Chinese"
};

export default function LanguageDialog(props) {
  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <FormattedMessage id="config.chooseLanguage" defaultMessage="Choose Language" />
      </DialogTitle>
      <DialogContent>
        <LocaleContext.Consumer>
          {([locale, setLocale]) => (
            <List>
              {Object.entries(LOCALES).map(([key, value]) => (
                <ListItem
                  key={key}
                  button
                  onClick={() => {
                    setLocale(key);
                    props.onClose();
                  }}
                >
                  <ListItemText primary={value} />
                </ListItem>
              ))}
            </List>
          )}
        </LocaleContext.Consumer>
      </DialogContent>
    </Dialog>
  );
}
