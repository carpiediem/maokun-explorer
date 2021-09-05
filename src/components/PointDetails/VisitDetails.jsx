import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import { YEARS, URLS } from './voyages.json';

/**
 * Component for showing treasureship visits to a place
 *
 * @component
 * @example
 * const voyages = [4, 5];
 * return (
 *   <VisitDetails voyages={voyages} />
 * )
 */
function VisitDetails({ voyages }) {
  const { locale } = useIntl();

  if (!voyages || voyages.length === 0) return null;

  return (
    <div>
      <Typography color="textSecondary" component="p">
        <FormattedMessage id="details.visited" defaultMessage="Visited by Treasure-Ships" />
      </Typography>
      <Typography variant="caption" component="p">
        {voyages.map((v) => (
          <Chip
            key={v}
            size="small"
            label={YEARS[v - 1]}
            component="a"
            href={URLS[locale][v - 1]}
            target="_blank"
            rel="noopener noreferrer"
            clickable
          />
        ))}
      </Typography>
    </div>
  );
}

VisitDetails.propTypes = {
  /**
   * An array of voyage indicies (1-based)
   */
  voyages: PropTypes.array.isRequired,
};

export default VisitDetails;
