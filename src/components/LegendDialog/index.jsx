import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import "./LegendDialog.css";

const CATEGORIES = [
  "town",
  "area",
  "building",
  "mountain",
  "peninsula",
  "island",
  "water body",
  "descriptor"
];

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  icon: {
    width: 25
  }
});

export default function LegendDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const DialogTitle = withStyles(styles)(props => {
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
          <DialogContentText>
            <List component="nav" aria-label="main mailbox folders">
              {CATEGORIES.map(c => (
                <ListItem key={c}>
                  <ListItemIcon>
                    <img
                      src={`./icons/${c}-identified.svg`}
                      alt={`${c} icon`}
                    />
                  </ListItemIcon>
                  <ListItemText primary={c} />
                </ListItem>
              ))}
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <div class="square identified" />
                </ListItemIcon>
                <ListItemText primary="Identified Locations" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <div class="square unidentified" />
                </ListItemIcon>
                <ListItemText primary="Unidentified Locations" />
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
