import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TranslateIcon from '@material-ui/icons/Translate';
import LockIcon from '@material-ui/icons/Lock';
import SyncIcon from '@material-ui/icons/Sync';
import PlaceIcon from '@material-ui/icons/Place';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';

import { LocaleContext } from '../../LocaleContext';
import LanguageDialog from './LanguageDialog';
import CategoryDialog from './CategoryDialog';

const LOCALES = {
  en: 'English',
  zh: 'Traditional Chinese',
  'zh-cn': 'Simplified Chinese',
};

const useStyles = makeStyles((theme) => ({
  listItemText: {
    '& .MuiListItemText-secondary': {
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
}));

function ConfigOptions(props) {
  const intl = useIntl();
  const classes = useStyles();
  const [locale] = React.useContext(LocaleContext);
  const [dialog, setDialog] = React.useState(null);

  return (
    <React.Fragment>
      <List>
        <ListSubheader component="div" id="nested-list-subheader">
          <FormattedMessage
            id="menu.preferences"
            defaultMessage="Preferences"
          />
        </ListSubheader>
        <ListItem button onClick={() => setDialog('language')}>
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <ListItemText
            primary={intl.formatMessage({
              id: 'config.language',
              defaultMessage: 'Language',
            })}
            secondary={intl.formatMessage({
              id: locale,
              defaultMessage: LOCALES[locale],
            })}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText
            primary={intl.formatMessage({
              id: 'config.lockPanes',
              defaultMessage: 'Lock Map Sizes',
            })}
            secondary={intl.formatMessage({
              id: props.lockPanes ? 'config.locked' : 'config.draggable',
              defaultMessage: props.lockPanes ? 'Locked' : 'Draggable',
            })}
            onClick={() => props.onChange('lockPanes', !props.lockPanes)}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SyncIcon />
          </ListItemIcon>
          <ListItemText
            primary={intl.formatMessage({
              id: 'config.syncMaps',
              defaultMessage: 'Sync Map Views',
            })}
            secondary={intl.formatMessage({
              id: props.syncMaps ? 'config.synced' : 'config.independant',
              defaultMessage: props.syncMaps ? 'Synced' : 'Independant',
            })}
            onClick={() => props.onChange('syncMaps', !props.syncMaps)}
          />
        </ListItem>
        <ListItem button onClick={() => setDialog('categories')}>
          <ListItemIcon>
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText
            primary={intl.formatMessage({
              id: 'config.showOverlays',
              defaultMessage: 'Show Overlays',
            })}
            secondary={Object.entries(props.categories)
              .filter(([key, enabled]) => enabled)
              .map(([key]) =>
                intl.formatMessage({
                  id: `categories.${key}`,
                  defaultMessage: key,
                })
              )
              .join(', ')}
            className={classes.listItemText}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <TextRotationNoneIcon />
          </ListItemIcon>
          <ListItemText
            primary={intl.formatMessage({
              id: 'config.labelLocations',
              defaultMessage: 'Label Locations',
            })}
            secondary={intl.formatMessage({
              id: props.labelLocations ? 'config.shown' : 'config.hidden',
              defaultMessage: props.labelLocations
                ? 'Labels are shown'
                : 'Labels are hidden'
                ? 'Labels are shown'
                : 'Labels are hidden',
            })}
            onClick={() =>
              props.onChange('labelLocations', !props.labelLocations)
            }
          />
        </ListItem>
      </List>
      <LanguageDialog
        open={dialog === 'language'}
        categories={props.language}
        onChange={(language) => {
          props.onChange('language', language);
          setDialog(null);
        }}
        onClose={() => setDialog(null)}
      />
      <CategoryDialog
        open={dialog === 'categories'}
        categories={props.categories}
        onChange={(key, value) =>
          props.onChange(
            'categories',
            Object.assign({}, props.categories, { [key]: value })
          )
        }
        onClose={() => setDialog(null)}
      />
    </React.Fragment>
  );
}

export default ConfigOptions;
