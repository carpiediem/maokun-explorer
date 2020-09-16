import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';

import { LocaleContext } from '../../LocaleContext';

// const LOCALES = {
//   en: "English",
//   zh: "Traditional Chinese"
//   // "zh-cn": "Simplified Chinese"
// };

export default function LanguageDialog(props) {
  // const intl = useIntl();
  const [locale, setLocale] = React.useContext(LocaleContext); // eslint-disable-line no-unused-vars

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <FormattedMessage
          id="config.chooseLanguage"
          defaultMessage="Choose Language"
        />
      </DialogTitle>
      <DialogContent>
        <List>
          <ListItem
            button
            onClick={() => {
              setLocale('en');
              props.onClose();
            }}
          >
            <ListItemText primary="English" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setLocale('zh');
              props.onClose();
            }}
          >
            <ListItemText primary="繁體版" />
          </ListItem>
          {
            //   Object.entries(LOCALES).map(([key, value]) => (
            //   <ListItem
            //     key={key}
            //     button
            //     color={locale === key ? "primary" : null}
            //     onClick={() => {
            //       setLocale(key);
            //       props.onClose();
            //     }}
            //   >
            //     <ListItemText
            //       primary={intl.formatMessage({
            //         id: key,
            //         defaultMessage: value
            //       })}
            //     />
            //   </ListItem>
            // ))
          }
        </List>
      </DialogContent>
    </Dialog>
  );
}
