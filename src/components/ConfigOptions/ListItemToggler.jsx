import React from 'react';
import { useIntl } from 'react-intl';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

function ListItemToggler({ checked, labelMessageId, valueMessageIds, onClick, icon }) {
  const { formatMessage } = useIntl();

  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        // id={labelMessageId}
        primary={formatMessage({
          id: labelMessageId,
        })}
        secondary={formatMessage({
          id: checked ? valueMessageIds[1] : valueMessageIds[0],
        })}
      />
      <ListItemSecondaryAction>
        <Switch color="primary" edge="end" checked={checked} />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ListItemToggler;
