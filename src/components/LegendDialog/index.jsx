import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import './LegendDialog.css';

const CATEGORIES = [
  'town',
  'area',
  'building',
  'mountain',
  'peninsula',
  'island',
  'water body',
  'descriptor',
];

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  icon: {
    width: 25,
  },
});

export default function LegendDialog(props) {
  const theme = useTheme();
  const intl = useIntl();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="about-dialog-title"
        id="legend"
      >
        <DialogTitle id="about-dialog-title">
          <FormattedMessage id="legend.title" defaultMessage="Map Legend" />
        </DialogTitle>
        <DialogContent>
          <List component="nav" aria-label="main mailbox folders">
            {CATEGORIES.map((c) => (
              <ListItem key={c}>
                <ListItemIcon>
                  <img src={`./icons/${c}-identified.svg`} alt={`${c} icon`} />
                </ListItemIcon>
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
              <ListItemIcon>
                <div className="square identified" />
              </ListItemIcon>
              <ListItemText
                primary={intl.formatMessage({
                  id: `status.identified`,
                  defaultMessage: 'Identified Locations',
                })}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <div className="square unidentified" />
              </ListItemIcon>
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
    </div>
  );
}
