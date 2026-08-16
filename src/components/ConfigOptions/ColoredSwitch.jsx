import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles({
  root: {
    '--switch-color': ({ color }) => color,
  },
  checked: {},
  track: {},
  switchBase: {
    color: 'var(--switch-color)',
    '&$checked': {
      color: 'var(--switch-color)',
    },
    '&$checked + $track': {
      backgroundColor: 'var(--switch-color)',
    },
  },
});

export default function ColoredSwitch({ color, ...rest }) {
  const classes = useStyles({ color });
  return <Switch classes={classes} color="default" {...rest} />;
}
