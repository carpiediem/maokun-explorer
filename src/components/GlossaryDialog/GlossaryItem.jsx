import React from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiListItemText-primary': { color: 'darkRed', fontWeight: 'bold' },
  },
  avatar: { backgroundColor: 'darkRed' },
}));

export default function AlignItemsList(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ListItem alignItems="flex-start" className={classes.root}>
        <ListItemAvatar>
          <Avatar className={classes.avatar}>{props.character}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={props.pinyin}
          secondary={
            <FormattedMessage
              id={props.definitionId}
              defaultMessage="[missing definition]"
            />
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
}
