import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Drawer,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Tooltip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MapIcon from "@material-ui/icons/Map";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";

import { LocaleContext } from "../../LocaleContext";
import WikipediaButton from "./WikipediaButton";
import asFraction from "../../util/asFraction";
import asLatitude from "../../util/asLatitude";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    "& dt": { fontSize: 14, marginTop: 12 },
    " & dd p": { margin: 0 }
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerPaper: { width: drawerWidth, height: "auto" }
}));

function PointDetails(props) {
  const [state, setState] = React.useState(false);
  const classes = useStyles();
  const intl = useIntl();
  const [locale] = React.useContext(LocaleContext);

  const toggleDrawer = open => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  if (!props.geojson.features.length || !props.id) {
    return null;
  }

  const { properties, geometry } = props.geojson.features.find(
    ({ properties: { id } }) => id === props.id
  );

  return (
    <Drawer
      anchor="right"
      open={state}
      onClose={toggleDrawer(false)}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {properties.labelTc}
          </Typography>
          <Typography variant="body2" component="p">
            {properties.labelEn}
          </Typography>
          <dl>
            <Typography color="textSecondary" component="dt">
              <FormattedMessage
                id="details.nowKnown"
                defaultMessage="Now known as"
              />
            </Typography>
            <Typography variant="body2" component="dd">
              {locale === "zh" ? properties.nameTc : properties.nameEn}
            </Typography>
            <Typography color="textSecondary" component="dt">
              <FormattedMessage
                id="details.navNotes"
                defaultMessage="Navigation Notes"
              />
            </Typography>
            <Typography variant="body2" component="dd">
              <p>一角三指</p>
              <p>
                {asFraction(geometry.kamalAngle)} fingers ={" "}
                {asLatitude(geometry.kamalAngle)} latitude
              </p>
            </Typography>
            <Typography color="textSecondary" component="dt">
              Latitude & Longitude
            </Typography>
            <Typography variant="body2" component="dd">
              7.799, 49.808
            </Typography>
          </dl>
        </CardContent>
        <CardActions>
          <Tooltip
            title={intl.formatMessage({
              id: "details.encyclopedia",
              defaultMessage: "View encyclopedia entry"
            })}
          >
            <WikipediaButton />
          </Tooltip>
          <Tooltip
            title={intl.formatMessage({
              id: "details.googleMaps",
              defaultMessage: "View in Google Maps"
            })}
          >
            <IconButton>
              <MapIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={intl.formatMessage({
              id: "details.reference",
              defaultMessage: "View reference"
            })}
          >
            <IconButton>
              <LocalLibraryIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Drawer>
  );
}

export default PointDetails;
