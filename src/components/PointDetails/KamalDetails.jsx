import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';

import asFraction from '../../util/asFraction';
import asLatitude from '../../util/asLatitude';

function KamalDetails({ text, angle }) {
  if (!text) return null;

  return (
    <div>
      <Typography color="textSecondary" component="p">
        <FormattedMessage
          id="details.navNotes"
          defaultMessage="Kamal Measurement"
        />
      </Typography>
      <Typography variant="body2" component="p">
        {text}
      </Typography>
      <Typography variant="body2" component="p">
        {asFraction(angle)}{' '}
        <FormattedMessage id="details.fingers" defaultMessage="fingers" /> ≈{' '}
        {asLatitude(angle)}{' '}
        <FormattedMessage id="details.latitude" defaultMessage="latitude" />
      </Typography>
    </div>
  );
}

export default KamalDetails;
