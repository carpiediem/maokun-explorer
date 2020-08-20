import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  DialogContentText,
  List,
  IconButton,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import GlossaryItem from "../GlossaryItem.jsx";

const styles = (theme) => ({
  root: {
    margin: 0,
    minWidth: 400,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

export default function GlossaryDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const externalLink = (url) => (...chunks) => (
    <a href={url} target="_blank" rel="noopener noreferrer" class="external">
      {chunks}
    </a>
  );

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="glossary-dialog-title"
      >
        <DialogTitle id="glossary-dialog-title">
          <FormattedMessage id="glossary.title" defaultMessage="Glossary" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <List>
              <GlossaryItem
                character="更"
                pinyin="gèng"
                definitionId="glossary.更"
              />
            </List>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
