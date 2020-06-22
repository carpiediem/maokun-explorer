import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

import { LocaleContext } from "../../LocaleContext";

const LOCALES = {
  en: "English",
  zh: "Traditional Chinese"
  // "zh-cn": "Simplified Chinese"
};

export default function LanguageDialog(props) {
  const intl = useIntl();
  const [locale, setLocale] = React.useContext(LocaleContext);

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
          {Object.entries(LOCALES).map(([key, value]) => (
            <ListItem
              key={key}
              button
              color={locale === key ? "primary" : null}
              onClick={() => {
                setLocale(key);
                props.onClose();
              }}
            >
              <ListItemText
                primary={intl.formatMessage({
                  id: key,
                  defaultMessage: value
                })}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
