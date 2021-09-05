import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';

const RE_CITE = /(.*)\s?(\[.*\])/;
export default function OtherPossibilities({ text }) {
  if (!text) return null;

  const citeMatch = RE_CITE.exec(text);

  return (
    <div>
      <Typography color="textSecondary" component="p">
        <FormattedMessage id="details.otherPossibilities" defaultMessage="Other Possibilities" />
      </Typography>
      <Typography variant="body2" component="p">
        {citeMatch[1]} <small>{citeMatch[2]}</small>
      </Typography>
    </div>
  );
}
