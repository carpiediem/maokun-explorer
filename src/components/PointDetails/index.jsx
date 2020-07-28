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
import WikipediaButtonGroup, { WikipediaIcon } from "./WikipediaButtonGroup";
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
    "& .MuiBackdrop-root": { backgroundColor: "transparent" }
  },
  drawerPaper: { width: drawerWidth, height: "auto", marginTop: 75 }
}));

function PointDetails(props) {
  // const [state, setState] = React.useState(false);
  const classes = useStyles();
  const intl = useIntl();
  const [locale] = React.useContext(LocaleContext);

  // const toggleDrawer = open => event => {
  //   if (
  //     event.type === "keydown" &&
  //     (event.key === "Tab" || event.key === "Shift")
  //   ) {
  //     return;
  //   }
  //
  //   setState(open);
  // };

  if (!props.geojson.features.length || !props.id) {
    return null;
  }

  const { properties, geometry } = props.geojson.features.find(
    ({ properties: { id } }) => id === props.id
  );
  const nowKnownAs = locale === "zh" ? properties.nameTc : properties.nameEn;

  return (
    <Drawer
      anchor="right"
      open={!!props.id}
      onClose={props.onClose}
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
            {nowKnownAs && (
              <React.Fragment>
                <Typography color="textSecondary" component="dt">
                  <FormattedMessage
                    id="details.nowKnown"
                    defaultMessage="Now known as"
                  />
                </Typography>
                <Typography variant="body2" component="dd">
                  {nowKnownAs}
                </Typography>
              </React.Fragment>
            )}

            {geometry.kamalAngle && (
              <React.Fragment>
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
              </React.Fragment>
            )}
            {geometry.coordinates.length > 0 && (
              <React.Fragment>
                <Typography color="textSecondary" component="dt">
                  Latitude & Longitude
                </Typography>
                <Typography variant="body2" component="dd">
                  {geometry.coordinates[1]}, {geometry.coordinates[0]}
                </Typography>
              </React.Fragment>
            )}
          </dl>
        </CardContent>
        <CardActions>
          {geometry.coordinates.length > 0 && (
            <Tooltip
              title={intl.formatMessage({
                id: "details.googleMaps",
                defaultMessage: "View in Google Maps"
              })}
            >
              <IconButton
                component="a"
                href={`https://www.google.com/maps/place/${geometry.coordinates[1]},${geometry.coordinates[0]}/@${geometry.coordinates[1]},${geometry.coordinates[0]},12z`}
                target="_blank"
              >
                <MapIcon />
              </IconButton>
            </Tooltip>
          )}
          {properties.referenceUrl && (
            <Tooltip
              title={intl.formatMessage({
                id: "details.reference",
                defaultMessage: "View reference"
              })}
            >
              <IconButton
                component="a"
                href={properties.referenceUrl}
                target="_blank"
              >
                <LocalLibraryIcon />
              </IconButton>
            </Tooltip>
          )}
          {(properties.aboutEn || properties.aboutTc) &&
            (properties.aboutEn && properties.aboutTc ? (
              <WikipediaButtonGroup {...properties} />
            ) : (
              <Tooltip
                title={intl.formatMessage({
                  id: "details.reference",
                  defaultMessage: "View reference"
                })}
              >
                <IconButton
                  component="a"
                  href={properties.aboutEn || properties.aboutTc}
                  target="_blank"
                >
                  <WikipediaIcon />
                </IconButton>
              </Tooltip>
            ))}
        </CardActions>
      </Card>
    </Drawer>
  );
}

export default PointDetails;
