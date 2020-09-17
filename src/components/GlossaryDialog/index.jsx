// Mention the magnetic north pole: different sources mention different locations; moving rapidly over this century
// https://planetearth2017.files.wordpress.com/2012/05/figure-9-the-closer-to-the-magnetic-pole-the-colder-it-gets2.png
// https://www.nasa.gov/sites/default/files/files/SMI_Problem12.pdf

// https://zh.wikipedia.org/zh-hk/%E6%B5%B7%E9%81%93%E9%92%88%E7%BB%8F

import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  List,
  IconButton,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import GlossaryItem from './GlossaryItem.jsx';

const styles = (theme) => ({
  root: {
    margin: 0,
    minWidth: 400,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

export default function GlossaryDialog(props) {
  const theme = useTheme();
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
        aria-labelledby="glossary-dialog-title"
      >
        <DialogTitle id="glossary-dialog-title">
          <FormattedMessage id="glossary.title" defaultMessage="Glossary" />
        </DialogTitle>
        <DialogContent>
          <List>
            <GlossaryItem
              character="更"
              pinyin="gèng"
              definitionId="glossary.更"
            />
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}
