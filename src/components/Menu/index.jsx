import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListIcon from '@material-ui/icons/ListAlt';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';

import ConfigOptions from '../ConfigOptions';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  button: {
    position: 'absolute',
    top: 0,
    left: '15px',
    zIndex: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    '&:hover': { backgroundColor: 'rgba(255, 255, 255,  0.8)' },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: { width: drawerWidth, height: 'auto' },
  toolbar: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  closeButton: { display: 'inline-flex' },
  title: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
}));

function Menu(props) {
  const [state, setState] = React.useState(false);
  const classes = useStyles();
  const intl = useIntl();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };

  return (
    <React.Fragment>
      <IconButton
        id="menu-toggle"
        color="inherit"
        aria-label="open menu"
        onClick={toggleDrawer(true)}
        edge="start"
        className={classes.button}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={state}
        onClose={toggleDrawer(false)}
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className="header">
          <IconButton
            onClick={toggleDrawer(false)}
            className={classes.closeButton}
          >
            <ChevronLeftIcon />
          </IconButton>{' '}
          <Typography variant="h6" noWrap className={classes.title}>
            <FormattedMessage
              id="menu.title"
              defaultMessage="Mao Kun Explorer"
            />
          </Typography>
        </div>
        <Divider />
        <ConfigOptions {...props.prefs} onChange={props.onChange} />
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              props.onDialogClick('glossary');
              setState(false);
            }}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText
              primary={intl.formatMessage({
                id: 'menu.glossary',
                defaultMessage: 'Glossary',
              })}
            />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              props.onDialogClick('about');
              setState(false);
            }}
          >
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={intl.formatMessage({
                id: 'menu.about',
                defaultMessage: 'About the Map',
              })}
            />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              props.onDialogClick('legend');
              setState(false);
            }}
          >
            <ListItemIcon>
              <NotListedLocationIcon />
            </ListItemIcon>
            <ListItemText
              primary={intl.formatMessage({
                id: 'menu.legend',
                defaultMessage: 'Map Legend',
              })}
            />
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
}

export default Menu;
