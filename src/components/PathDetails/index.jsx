import React, { useState, useEffect } from 'react';
import { toDataURL } from 'qrcode';
import { useIntl } from 'react-intl';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShareIcon from '@material-ui/icons/Share';

const drawerWidth = 310;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    pointerEvents: 'none',
    '& .MuiBackdrop-root': { backgroundColor: 'transparent' },
  },
  drawerPaper: {
    width: drawerWidth,
    height: 'auto',
    marginTop: 75,
    pointerEvents: 'all',
  },
  content: { maxHeight: 'calc(100vh - 215px)', overflowY: 'auto' },
  name: {
    position: 'sticky',
    top: '-16px',
    backgroundColor: 'white',
    fontSize: '1.2rem',
  },
  share: { fontSize: '0.5em' },
  in: { backgroundColor: 'pink', marginBottom: '0.5em' },
  out: { backgroundColor: '#90ee9066', marginBottom: '0.5em' },
  text: { paddingLeft: 16, fontSize: '0.75em', '& li': { padding: 0 } },
  translation: { paddingLeft: 16, fontSize: '0.85em', '& li': { padding: 0 } },
  accordion: { marginTop: '1em' },
  qrcode: {
    display: 'block',
    margin: '10px auto',
  },
}));

function PathDetails(props) {
  const classes = useStyles();
  const intl = useIntl();
  const [qrcode, setQrcode] = useState('https://media0.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif');
  const [showingQrcode, setShowingQrcode] = useState(false);

  const { properties } = props.paths?.find(({ properties: { code } }) => code === props.id) || {};

  useEffect(() => {
    if (!properties?.code) return;

    setShowingQrcode(false);
    toDataURL(`http://zhenghe.rslc.us/#/path/${properties.code}`).then(setQrcode);
  }, [setQrcode, properties?.code]);

  if (!props.paths.length || !props.id) {
    return null;
  }

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
            {intl.locale === 'en' ? properties.name : properties.nameTc}
            {props.outlinksDisabled ? (
              <IconButton onClick={() => setShowingQrcode(true)}>
                <ShareIcon className={classes.share} />
              </IconButton>
            ) : (
              <IconButton component="a" href={`#/path/${properties.code}`}>
                <ShareIcon className={classes.share} />
              </IconButton>
            )}
          </Typography>
          {properties.direction && (
            <Chip
              size="small"
              label={intl.formatMessage({
                id: `paths.${properties.direction}`,
              })}
              className={classes[properties.direction]}
            />
          )}

          {showingQrcode && <img alt="QR code of the URL for this path" src={qrcode} className={classes.qrcode} />}

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
          {properties.millsTranslation.length === 0 ? null : (
            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="caption">J.V.G. Mills' Translation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {properties.millsTranslation}{' '}
                  <Typography variant="caption">
                    (
                    <a
                      href="https://books.google.com.hk/books?id=DjQ9AAAAIAAJ&pg=PA261"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      source
                    </a>
                    )
                  </Typography>
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </Drawer>
  );
}

export default PathDetails;
