import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';

import IntroAnimation from './IntroAnimation';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 1000,
    maxWidth: '90vw',
    minHeight: 600,
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#b95644',
    backgroundImage: 'url(/images/treasureship.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
  },
  title: { fontFamily: 'Fruktur, cursive', fontSize: '4em' },
  svg: { maxHeight: '40vh' },
  button: {
    fontFamily: 'Satisfy, cursive',
    fontSize: '1.5em',
    borderRadius: '29px',
    padding: '0 2em',
    marginBottom: '1em',
    color: '#a22e2d',
    backgroundColor: 'white',
    '&:hover': { color: 'white', backgroundColor: 'darkRed' },
  },
}));

export default function IntroDialog(props) {
  const classes = useStyles();
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  // const { locale } = useIntl();

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="intro-dialog"
      classes={{ paper: classes.paper }}
    >
      <DialogTitle classes={{ root: classes.title }} disableTypography>
        <FormattedMessage id="intro.title" defaultMessage="Mao Kun Explorer" />
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6">
          <FormattedMessage id="intro.abstract" />
        </Typography>
        <IntroAnimation />
        <Button
          size="large"
          className={classes.button}
          onClick={props.handleClose}
        >
          Take a Look
        </Button>
      </DialogContent>
    </Dialog>
  );
}
