import React from 'react';
import { useIntl } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function CardAction({ messageId, defaultMessage, href, onClick, icon }) {
  const { formatMessage } = useIntl();

  if ((!href && onClick === undefined) || !icon) return null;

  return (
    <Tooltip title={formatMessage({ id: messageId, defaultMessage })}>
      <IconButton component="a" href={href} target="_blank" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
}

export default CardAction;
