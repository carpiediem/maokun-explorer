import React, { useEffect, useState } from 'react';
import { toDataURL } from 'qrcode';
import { Drawer, Card, CardContent, CardActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MapIcon from '@material-ui/icons/Map';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import ShareIcon from '@material-ui/icons/Share';

import PointHeader from './PointHeader';
import CategoryChip from './CategoryChip';
import ModernNames from './ModernNames';
import KamalDetails from './KamalDetails';
import VisitDetails from './VisitDetails';
import OtherPossibilities from './OtherPossibilities';
import CardAction from './CardAction';
import WikipediaFlexiButton from './WikipediaFlexiButton/index';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    pointerEvents: 'none',
    '& .MuiBackdrop-root': {
      backgroundColor: 'transparent',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    height: 'auto',
    marginTop: 75,
    pointerEvents: 'all',
    '& .MuiChip-clickable': {
      fontSize: '0.8em',
      height: 16,
      margin: '0 1px',
    },
  },
  qrcode: {
    display: 'block',
    margin: '10px auto',
  },
}));

function PointDetails(props) {
  const classes = useStyles();
  const [qrcode, setQrcode] = useState('https://media0.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif');
  const [showingQrcode, setShowingQrcode] = useState(false);

  const { properties, geometry } = props.places?.find(({ properties: { id } }) => id === props.id) || {};

  useEffect(() => {
    if (!properties?.id) return;

    setShowingQrcode(false);
    toDataURL(`http://zhenghe.rslc.us/#/place/${properties.id}`).then(setQrcode);
  }, [setQrcode, properties?.id]);

  if (!props.places.length || props.id === null || props.id === undefined) {
    return null;
  }

  const extraInfo = properties.kamalNotes.length || properties.voyages.length || properties.otherPossibilities.length;
  const mapUrl =
    geometry.coordinates.length > 0
      ? `https://www.google.com/maps/place/${geometry.coordinates[1]},${geometry.coordinates[0]}/@${geometry.coordinates[1]},${geometry.coordinates[0]},12z`
      : null;

  return (
    <Drawer
      anchor="right"
      open={props.id !== null}
      onClose={() => props.onSelect()}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <Card className={classes.root}>
        <CardContent>
          <PointHeader {...properties} />
          <CategoryChip category={properties.category} />
          <hr />
          <ModernNames {...properties} />
          {extraInfo ? <hr /> : null}
          <KamalDetails text={properties.kamalNotes} angle={geometry.kamalAngle} />
          <VisitDetails voyages={properties.voyages} />
          <OtherPossibilities text={properties.otherPossibilities} />
          {showingQrcode && <img alt="QR code of the URL for this place" src={qrcode} className={classes.qrcode} />}
        </CardContent>
        {props.outlinksDisabled ? (
          !showingQrcode && (
            <CardActions>
              <CardAction
                onClick={() => setShowingQrcode(true)}
                icon={<ShareIcon />}
                messageId="details.qrcode"
                defaultMessage="Share via QR Code"
              />
            </CardActions>
          )
        ) : (
          <CardActions>
            <CardAction
              href={mapUrl}
              icon={<MapIcon />}
              messageId="details.googleMaps"
              defaultMessage="View in Google Maps"
            />
            <CardAction
              href={properties.sourceUrl}
              icon={<LocalLibraryIcon />}
              messageId="details.reference"
              defaultMessage="View reference"
            />
            <WikipediaFlexiButton {...properties} />
            <CardAction
              href={`#/place/${properties.id}`}
              external={false}
              icon={<ShareIcon />}
              messageId="details.directlink"
              defaultMessage="Direct Link"
            />
          </CardActions>
        )}
      </Card>
    </Drawer>
  );
}

export default PointDetails;
