import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import ConfigOptions from "../ConfigOptions";
// import { LocaleContext } from "../LocaleContext";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerPaper: { width: drawerWidth, height: "auto" },
  toolbar: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  closeButton: { display: "inline-flex" },
  title: {
    display: "inline-flex",
    verticalAlign: "middle"
  }
}));

function Menu() {
  // const [locale, setLocale] = React.useContext(LocaleContext);
  // const nextLocale = locale === "en" ? "zh" : "en";

  const [state, setState] = React.useState(false);
  const classes = useStyles();
  const intl = useIntl();

  const toggleDrawer = open => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
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
          </IconButton>{" "}
          <Typography variant="h6" noWrap className={classes.title}>
            <FormattedMessage
              id="menu.title"
              defaultMessage="Mao Kun Explorer"
            />
          </Typography>
        </div>
        <Divider />
        <ConfigOptions />
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={intl.formatMessage({
                id: "menu.about",
                defaultMessage: "About the Map"
              })}
            />
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
}

export default Menu;
