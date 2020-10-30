import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import TranslateIcon from '@material-ui/icons/Translate';
import LockIcon from '@material-ui/icons/Lock';
import SyncIcon from '@material-ui/icons/Sync';
import TuneIcon from '@material-ui/icons/Tune';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';

import LanguageDialog from './LanguageDialog';
import FilterDialog from './FilterDialog';
import allOrCount from './allOrCount';
import ListItemToggler from './ListItemToggler';

import filterChangeHof from './filterChangeHof';

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
  const [dialog, setDialog] = useState(null);

  const toggle = (pref) => () => props.onChange(pref, !props[pref]);
  const handleLanguageChange = (language) => {
    props.onChange('language', language);
    setDialog(null);
  };
  const handleFilterChange = filterChangeHof(
    props.onChange,
    props.categories,
    props.voyages
  );

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

        <ListItemToggler
          labelMessageId="config.lockPanes"
          valueMessageIds={['config.draggable', 'config.locked']}
          checked={props.lockPanes}
          onClick={toggle('lockPanes')}
          icon={<LockIcon />}
        />
        <ListItemToggler
          labelMessageId="config.syncMaps"
          valueMessageIds={['config.independant', 'config.synced']}
          checked={props.syncMaps}
          onClick={toggle('syncMaps')}
          icon={<SyncIcon />}
        />
        <ListItemToggler
          labelMessageId="config.labelLocations"
          valueMessageIds={['config.hidden', 'config.shown']}
          checked={props.labelLocations}
          onClick={toggle('labelLocations')}
          icon={<TextRotationNoneIcon />}
        />
      </List>

      <LanguageDialog
        open={dialog === 'language'}
        categories={props.language}
        onChange={handleLanguageChange}
        onClose={() => setDialog(null)}
      />
      <FilterDialog
        open={dialog === 'categories'}
        categories={props.categories}
        voyages={props.voyages}
        onChange={handleFilterChange}
        onClose={() => setDialog(null)}
      />
    </React.Fragment>
  );
}

export default ConfigOptions;
