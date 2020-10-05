import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

// import { LocaleContext } from '../../LocaleContext';
// import externalLink from '../externalLink';

import sights from './maokun-sights.json';
const groups = [
  'Western Indian Coast',
  'Maldives and Lakshadweep',
  'Arabian Peninsula',
  'East African Coast',
];

const useStyles = makeStyles((theme) => ({
  root: {},
  autoWidth: { width: 'auto' },
  subheader: {
    backgroundColor: 'beige',
    '& span': {
      margin: 0,
      lineHeight: '0.9em',
      textAlign: 'center',
    },
  },
  head: {
    '& th': {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const FINGER = 1.616666;
const POLAR_DISTANCE = {
  Polaris: 3.8548333,
  'χ Dra': 17.5750278,
  Kochab: 13.49038,
};

export default function GlossaryDialog(props) {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // const [locale] = React.useContext(LocaleContext);

  function latCalc(altitude, star) {
    const latitude =
      POLAR_DISTANCE[star] +
      (star === 'Polaris' ? altitude * FINGER : -altitude * FINGER);
    return `${Math.abs(latitude).toFixed(2)}° ${latitude < 0 ? 'S' : 'N'}`;
  }
  function latError(altitude, star, latitude) {
    const error =
      POLAR_DISTANCE[star] +
      (star === 'Polaris' ? altitude * FINGER : -altitude * FINGER) -
      latitude;
    return `${error > 0 ? '+' : ''}${error.toFixed(2)}°`;
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="md"
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="glossary-dialog-title"
    >
      <DialogTitle>
        {fullScreen && (
          <IconButton onClick={props.handleClose} style={{ marginLeft: -16 }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
        <FormattedMessage
          id="navigation.title"
          defaultMessage="Celestial Navigation"
        />
        <a href="#/navigation" title="Direct Link" className="direct">
          #
        </a>
      </DialogTitle>

      <DialogContent>
        <h3>Latitude Calculations</h3>
        <p>
          Knowing the position of reference stars in the 1400s (from Stellarium)
          and the size of a "finger" (from antique kamals: 1° 37'), the Mao Kun
          Map's altitude sights can be converted to latitudes.
        </p>

        <h4>Known Locations</h4>
        <Table size="small" stickyHeader className={classes.autoWidth}>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Sight</TableCell>
              <TableCell>Altitude</TableCell>
              <TableCell>Star</TableCell>
              <TableCell align="right">Calculation</TableCell>
              <TableCell align="right">Error</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((g) => (
              <React.Fragment key={g}>
                <TableRow className={classes.subheader}>
                  <TableCell colSpan={7}>
                    <Typography variant="overline" display="block" gutterBottom>
                      {g}
                    </Typography>
                  </TableCell>
                </TableRow>
                {sights
                  .filter(({ group }) => group === g)
                  .map((s) => (
                    <TableRow key={s.text} className={classes.row}>
                      <TableCell>{s.text}</TableCell>
                      <TableCell>{s.location}</TableCell>
                      <TableCell>{s.sight}</TableCell>
                      <TableCell>{s.altitude}</TableCell>
                      <TableCell>{s.star}</TableCell>
                      <TableCell align="right">
                        {latCalc(s.altitude, s.star)}
                      </TableCell>
                      <TableCell align="right">
                        {latError(s.altitude, s.star, s.actual)}
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        <h4>Sights without Specified Names</h4>
        <Table size="small" stickyHeader className={classes.autoWidth}>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell>Approximate Location</TableCell>
              <TableCell>Sight</TableCell>
              <TableCell>Altitude</TableCell>
              <TableCell>Star</TableCell>
              <TableCell align="right">Calculation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sights
              .filter(({ group }) => group === 'Unnamed')
              .map((s, i) => (
                <TableRow key={i} className={classes.row}>
                  <TableCell>{s.location}</TableCell>
                  <TableCell>{s.sight}</TableCell>
                  <TableCell>{s.altitude}</TableCell>
                  <TableCell>{s.star}</TableCell>
                  <TableCell align="right">
                    {/* {latCalc(s.altitude, s.star)} */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <h3>Stars Used for Altitude Sights</h3>
        <p>
          These stars are sighted with a kamal. Their angular distance from the
          horizon (altitude) is used to determine latitude. Values below are for
          1 May, 1422.
        </p>
        <Table size="small" stickyHeader className={classes.autoWidth}>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell>Star</TableCell>
              <TableCell>Right Ascension</TableCell>
              <TableCell>Declination</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Polaris"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Polaris
                </a>
              </TableCell>
              <TableCell>0h09m46.20s</TableCell>
              <TableCell>+86º08'42.6"</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Chi_Draconis"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  χ Dra
                </a>
              </TableCell>
              <TableCell>18h31m19.12s</TableCell>
              <TableCell>+72º25'29.9"</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Beta_Ursae_Minoris"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kochab
                </a>
              </TableCell>
              <TableCell>14h54m56.08s</TableCell>
              <TableCell>+76º30'34.6"</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h3>Stars Used for Azimuth Sights</h3>
        <p>
          These stars are sighted while they are near the horizon. They rise and
          set in known positions (for a given place and season), so they can be
          used to keep a steady course. Values below (time and azimuth) are for
          1 May, 1422. Starrise values have been calculated with a position at
          Al Mukalla, Yemen. Starset values have been calculated with a position
          at Sur, Oman.
        </p>
        <Table size="small" stickyHeader className={classes.autoWidth}>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell>Star</TableCell>
              <TableCell>Rises at</TableCell>
              <TableCell>Sets at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Pollux_(star)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pollux
                </a>
              </TableCell>
              <TableCell>after sunrise</TableCell>
              <TableCell>302º</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Procyon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Procyon
                </a>
              </TableCell>
              <TableCell>after sunrise</TableCell>
              <TableCell>277º</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Beta_Scorpii"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acrab
                </a>
              </TableCell>
              <TableCell>108º</TableCell>
              <TableCell>after sunrise</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Capella"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Capella
                </a>
              </TableCell>
              <TableCell>after sunrise</TableCell>
              <TableCell>321º</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Beta_Pegasi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scheat
                </a>
              </TableCell>
              <TableCell>64º</TableCell>
              <TableCell>daytime</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a
                  href="https://en.wikipedia.org/wiki/Fomalhaut"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fomalhaut
                </a>
              </TableCell>
              <TableCell>124º</TableCell>
              <TableCell>daytime</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                斗宿一 (
                <a
                  href="https://en.wikipedia.org/wiki/Dipper_(Chinese_constellation)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  φ Sgr
                </a>
                )
              </TableCell>
              <TableCell>118º</TableCell>
              <TableCell>after sunrise</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
