import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@material-ui/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import './LegendDialog.css';
import CATEGORIES from '../ConfigOptions/categories.json';

export default function LegendDialog(props) {
  const theme = useTheme();
  const intl = useIntl();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="about-dialog-title"
      id="legend"
    >
      <DialogTitle>
        {fullScreen && (
          <IconButton onClick={props.handleClose}>
            <ChevronLeftIcon />
          </IconButton>
        )}
        <FormattedMessage id="legend.title" defaultMessage="Map Legend" />
        <a href="#/legend" title="Direct Link" className="direct">
          #
        </a>
      </DialogTitle>

      <DialogContent>
        <List component="nav" aria-label="main mailbox folders">
          {CATEGORIES.map((c) => (
            <ListItem key={c}>
              <ListItemAvatar>
                <Avatar className={c}>&nbsp;</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={intl.formatMessage({
                  id: `categories.${c}`,
                  defaultMessage: c,
                })}
              />
            </ListItem>
          ))}
          <Divider />
          <ListItem>
            <ListItemAvatar>
              <Avatar className="unidentified">&nbsp;</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={intl.formatMessage({
                id: `status.unidentified`,
                defaultMessage: 'Unidentified Locations',
              })}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
}
