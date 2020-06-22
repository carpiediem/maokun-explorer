import React from "react";
import { useIntl } from "react-intl";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import TranslateIcon from "@material-ui/icons/Translate";
import LockIcon from "@material-ui/icons/Lock";
import SyncIcon from "@material-ui/icons/Sync";
import PlaceIcon from "@material-ui/icons/Place";

// import { LocaleContext } from "../LocaleContext";

import "./ConfigOptions.css";

function ConfigOptions() {
  const intl = useIntl();
  // const [locale, setLocale] = React.useContext(LocaleContext);
  // const nextLocale = locale === "en" ? "zh" : "en";

  return (
    <List>
      <ListItem button>
        <ListItemIcon>
          <TranslateIcon />
        </ListItemIcon>
        <ListItemText
          primary={intl.formatMessage({
            id: "config.language",
            defaultMessage: "Language"
          })}
          secondary="English"
        />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <LockIcon />
        </ListItemIcon>
        <ListItemText
          primary={intl.formatMessage({
            id: "config.lockPanes",
            defaultMessage: "Lock Map Size"
          })}
          secondary="Unlocked"
        />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <SyncIcon />
        </ListItemIcon>
        <ListItemText
          primary={intl.formatMessage({
            id: "config.syncMaps",
            defaultMessage: "Sync Map Views"
          })}
          secondary="Synced"
        />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PlaceIcon />
        </ListItemIcon>
        <ListItemText
          primary={intl.formatMessage({
            id: "config.showOverlays",
            defaultMessage: "Show Overlays"
          })}
          secondary="Towns, Mountains"
        />
      </ListItem>
    </List>
  );
}

export default ConfigOptions;
