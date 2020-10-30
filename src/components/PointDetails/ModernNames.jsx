import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  otherNames: { color: '#888', fontSize: '0.8em' },
}));

function ModernNames({ nameEn, nameTc, othersEn, othersTc, region }) {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Fragment>
      <Typography variant="h5" component="h2">
        {intl.locale === 'en' ? nameEn : nameTc}
      </Typography>
      <Typography variant="body2" component="p" className={classes.region}>
        {region && (
          <FormattedMessage
            id={`regions.${region.toLowerCase()}`}
            defaultMessage={region}
          />
        )}
      </Typography>
      <Typography
        variant="body2"
        component="p"
        className={classes.otherNames}
        title={intl.formatMessage({
          id: 'details.aka',
          defaultMessage: 'also known as',
        })}
      >
        {intl.locale === 'en' ? othersEn : othersTc}
      </Typography>
    </Fragment>
  );
}

export default ModernNames;
