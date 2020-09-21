import React from 'react';
// import { FormattedMessage, useIntl } from 'react-intl';
import { Drawer, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// import { LocaleContext } from '../../LocaleContext';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {},
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiBackdrop-root': { backgroundColor: 'transparent' },
  },
  drawerPaper: { width: drawerWidth, height: 'auto', marginTop: 75 },
  content: { maxHeight: 'calc(100vh - 215px)', overflowY: 'auto' },
  name: { position: 'sticky', top: '-16px', backgroundColor: 'white' },
  text: { paddingLeft: 16, fontSize: '0.85em', '& li': { padding: 0 } },
  translation: { paddingLeft: 16, fontSize: '0.85em', '& li': { padding: 0 } },
}));

function PathDetails(props) {
  const classes = useStyles();
  // const intl = useIntl();
  // const [locale] = React.useContext(LocaleContext);

  if (!props.paths.length || !props.id) {
    return null;
  }

  const { properties } = props.paths.find(
    ({ properties: { code } }) => code === props.id
  );

  // Bug: Sometimes .split() results in a single character item at the end of the array. Sometimes it doesn't.

  return (
    <Drawer
      anchor="right"
      open={!!props.id}
      onClose={() => props.onSelect()}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Typography variant="h5" component="h2" className={classes.name}>
            {properties.name}
          </Typography>
          <Typography
            variant="body2"
            component="ol"
            className={classes.text}
            dangerouslySetInnerHTML={{ __html: properties.textHtml }}
          />
          <hr />
          <Typography
            variant="body2"
            component="ol"
            className={classes.translation}
            dangerouslySetInnerHTML={{ __html: properties.translationHtml }}
          />
        </CardContent>
      </Card>
    </Drawer>
  );
}

export default PathDetails;
