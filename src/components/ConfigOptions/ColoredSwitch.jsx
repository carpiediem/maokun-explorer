import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles({
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
  const classes = useStyles();
  const style = color ? { '--switch-color': color } : undefined;
  return <Switch classes={classes} style={style} {...rest} />;
}
