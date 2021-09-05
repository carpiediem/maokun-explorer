import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import ShowIcon from '@material-ui/icons/Visibility';
import HideIcon from '@material-ui/icons/VisibilityOff';

import CATEGORIES from './categories-colors.json';
import ColoredSwitch from './ColoredSwitch';

const VOYAGES = ['none', 1, 2, 3, 4, 5, 6, 7];

const useStyles = makeStyles((theme) => ({
  content: { '& fieldset': { width: 500 } },
  toggleAll: {
    '& .MuiButton-startIcon': {
      marginLeft: 0,
      marginRight: '18px',
    },
  },
}));

export default function FilterDialog(props) {
  const intl = useIntl();
  const classes = useStyles();
  const { categories = {}, voyages = {} } = props;

  const allCategories = Object.keys(CATEGORIES).reduce((agg, cur) => agg && categories[cur], true);
  const allVoyages = VOYAGES.reduce((agg, cur) => agg && voyages[cur], true);

  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <FormattedMessage id="config.chooseCategories" defaultMessage="Filter Markers" />
      </DialogTitle>
      <DialogContent className={classes.content}>
        <FormControl component="fieldset">
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Place Categories
              </Typography>
              <FormGroup>
                {Object.entries(CATEGORIES).map(([category, color]) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <ColoredSwitch
                        color={color}
                        checked={categories[category]}
                        onChange={() => props.onChange('categories', category, !categories[category])}
                        name={category}
                      />
                    }
                    label={intl.formatMessage({
                      id: `categories.${category}`,
                      defaultMessage: category,
                    })}
                  />
                ))}
              </FormGroup>
              {allCategories ? (
                <Button
                  className={classes.toggleAll}
                  startIcon={<HideIcon />}
                  onClick={() => props.onChange(null, false)}
                >
                  Switch all off
                </Button>
              ) : (
                <Button
                  className={classes.toggleAll}
                  startIcon={<ShowIcon />}
                  onClick={() => props.onChange(null, true)}
                >
                  Switch all on
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Treasure Ship Visits
              </Typography>
              <FormGroup>
                {VOYAGES.map((voyage) => (
                  <FormControlLabel
                    key={voyage}
                    control={
                      <ColoredSwitch
                        color="darkRed"
                        checked={voyages[voyage]}
                        onChange={() => props.onChange('voyages', voyage, !voyages[voyage])}
                        name={voyage.toString()}
                      />
                    }
                    label={intl.formatMessage({
                      id: `voyages.${voyage}`,
                      defaultMessage: voyage.toString(),
                    })}
                  />
                ))}
              </FormGroup>
              {allVoyages ? (
                <Button
                  className={classes.toggleAll}
                  startIcon={<HideIcon />}
                  onClick={() => props.onChange('voyages', null, false)}
                >
                  Switch all off
                </Button>
              ) : (
                <Button
                  className={classes.toggleAll}
                  startIcon={<ShowIcon />}
                  onClick={() => props.onChange('voyages', null, true)}
                >
                  Switch all on
                </Button>
              )}
            </Grid>
          </Grid>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
