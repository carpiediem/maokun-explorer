import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  translation: { color: '#888', fontSize: '0.8em' },
}));

function PointHeader({ label, pinyin, translation }) {
  const classes = useStyles();

  return (
    <Fragment>
      <Typography variant="h5" component="h2">
        {label}
      </Typography>
      <Typography variant="body2" component="p" className={classes.pinyin}>
        {pinyin}
      </Typography>
      <Typography variant="body2" component="p" className={classes.translation}>
        {translation}
      </Typography>
    </Fragment>
  );
}

export default PointHeader;
