import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TranslateIcon from '@material-ui/icons/Translate';
import LockIcon from '@material-ui/icons/Lock';
import SyncIcon from '@material-ui/icons/Sync';
import TuneIcon from '@material-ui/icons/Tune';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';

import LanguageDialog from './LanguageDialog';
import FilterDialog from './FilterDialog';
import allOrCount from './allOrCount';

import CATEGORIES from './categories.json';
const VOYAGES = ['none', 1, 2, 3, 4, 5, 6, 7];
const LOCALES = {
  en: 'English',
  zh: 'Traditional Chinese',
  'zh-cn': 'Simplified Chinese',
};

const ALL_CATEGORIES = CATEGORIES.reduce((agg, cur) => {
  agg[cur] = true;
  return agg;
}, {});
const NO_CATEGORIES = CATEGORIES.reduce((agg, cur) => {
  agg[cur] = false;
  return agg;
}, {});
const ALL_VOYAGES = VOYAGES.reduce((agg, cur) => {
  agg[cur] = true;
  return agg;
}, {});
const NO_VOYAGES = VOYAGES.reduce((agg, cur) => {
  agg[cur] = false;
  return agg;
}, {});

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
  const [dialog, setDialog] = useState(null);

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
              id: intl.locale,
              defaultMessage: LOCALES[intl.locale],
            })}
          />
        </ListItem>
        <ListItem button onClick={() => setDialog('categories')}>
          <ListItemIcon>
            <TuneIcon />
          </ListItemIcon>
          <ListItemText
            primary={intl.formatMessage({
              id: 'config.showOverlays',
              defaultMessage: 'Filter Markers',
            })}
            secondary={`${allOrCount(props.categories)} ${intl.formatMessage({
              id: 'config.categories',
              defaultMessage: 'categories',
            })}; ${allOrCount(props.voyages)} ${intl.formatMessage({
              id: 'config.voyages',
              defaultMessage: 'voyages',
            })}`}
            className={classes.listItemText}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => props.onChange('lockPanes', !props.lockPanes)}
        >
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText
            id="switch-list-lock-map-sizes"
            primary={intl.formatMessage({
              id: 'config.lockPanes',
              defaultMessage: 'Lock Map Sizes',
            })}
            secondary={intl.formatMessage({
              id: props.lockPanes ? 'config.locked' : 'config.draggable',
              defaultMessage: props.lockPanes ? 'Locked' : 'Draggable',
            })}
          />
          <ListItemSecondaryAction>
            <Switch
              color="primary"
              edge="end"
              checked={props.lockPanes}
              inputProps={{ 'aria-labelledby': 'switch-list-lock-map-sizes' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem
          button
          onClick={() => props.onChange('syncMaps', !props.syncMaps)}
        >
          <ListItemIcon>
            <SyncIcon />
          </ListItemIcon>
          <ListItemText
            id="switch-list-sync-maps"
            primary={intl.formatMessage({
              id: 'config.syncMaps',
              defaultMessage: 'Sync Map Views',
            })}
            secondary={intl.formatMessage({
              id: props.syncMaps ? 'config.synced' : 'config.independant',
              defaultMessage: props.syncMaps ? 'Synced' : 'Independant',
            })}
          />
          <ListItemSecondaryAction>
            <Switch
              color="primary"
              edge="end"
              checked={props.syncMaps}
              inputProps={{ 'aria-labelledby': 'switch-list-sync-maps' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem
          button
          onClick={() =>
            props.onChange('labelLocations', !props.labelLocations)
          }
        >
          <ListItemIcon>
            <TextRotationNoneIcon />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-locations"
            primary={intl.formatMessage({
              id: 'config.labelLocations',
              defaultMessage: 'Show Place Names',
            })}
            secondary={intl.formatMessage({
              id: props.labelLocations ? 'config.shown' : 'config.hidden',
              defaultMessage: props.labelLocations
                ? 'Labels are shown'
                : 'Labels are hidden',
            })}
          />
          <ListItemSecondaryAction>
            <Switch
              color="primary"
              edge="end"
              checked={props.labelLocations}
              inputProps={{ 'aria-labelledby': 'switch-list-label-locations' }}
            />
          </ListItemSecondaryAction>
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
      <FilterDialog
        open={dialog === 'categories'}
        categories={props.categories}
        voyages={props.voyages}
        onChange={(group, key, value) => {
          if (key === null) {
            switch (group) {
              case 'categories':
                props.onChange(group, value ? ALL_CATEGORIES : NO_CATEGORIES);
                break;
              case 'voyages':
                props.onChange(group, value ? ALL_VOYAGES : NO_VOYAGES);
                break;
              default:
            }

            return;
          }
          props.onChange(
            group,
            Object.assign({}, props[group], { [key]: value })
          );
        }}
        onClose={() => setDialog(null)}
      />
    </React.Fragment>
  );
}

export default ConfigOptions;
