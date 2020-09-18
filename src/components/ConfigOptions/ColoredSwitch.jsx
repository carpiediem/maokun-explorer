import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

export default function ColoredSwitch({ color, ...rest }) {
  const ColorOnly = withStyles({
    switchBase: {
      color,
      '&$checked': {
        color,
      },
      '&$checked + $track': {
        backgroundColor: color,
      },
    },
    checked: {},
    track: {},
  })(Switch);

  return <ColorOnly {...rest} />;
}
