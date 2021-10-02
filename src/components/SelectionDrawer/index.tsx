import React, { useState } from 'react';
import { Button, Drawer, Card, CardContent, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 310;
const isOpen = document.location.pathname === '/selection';

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
}));

type CartesianPoint = number[];

interface SelectionDrawerProps {
  modernCoords: { lat: number; lng: number }[];
  maokunCoords: CartesianPoint[];
  onReset: () => void;
}

function SelectionDrawer(props: SelectionDrawerProps) {
  const classes = useStyles();
  const [code, setCode] = useState<string>();

  const modernCsv = props.modernCoords
    .map(({ lat, lng }) => `${code}\t${lat.toFixed(6)}\t${lng.toFixed(6)}\n`)
    .join('');
  const maokunCsv = props.maokunCoords.map(([x, y]) => `${code}\t${x.toFixed(0)}\t${y.toFixed(0)}\n`).join('');

  return (
    <Drawer anchor="right" open={isOpen} className={classes.drawer} classes={{ paper: classes.drawerPaper }}>
      <Card>
        <CardContent className={classes.content}>
          <form noValidate autoComplete="off">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField onChange={({ target }) => setCode(target.value)} label="Code" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={maokunCsv}
                  label="Zoomify Coordinates"
                  size="small"
                  fullWidth
                  multiline
                  rows={6}
                  InputProps={{ readOnly: true, style: { fontSize: 9, lineHeight: 1 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={modernCsv}
                  label="Geographic Coordinates"
                  size="small"
                  fullWidth
                  multiline
                  rows={6}
                  InputProps={{ readOnly: true, style: { fontSize: 9, lineHeight: 1 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button color="secondary" variant="contained" fullWidth onClick={props.onReset}>
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Drawer>
  );
}

export default SelectionDrawer;
