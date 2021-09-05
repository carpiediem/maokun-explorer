import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

// import { LocaleContext } from '../../LocaleContext';
// import externalLink from '../externalLink';
import getAzimuth from './getAzimuth';

import sights from './maokun-sights.json';
const groups = ['Western Indian Coast', 'Maldives and Lakshadweep', 'Arabian Peninsula', 'East African Coast'];

const useStyles = makeStyles((theme) => ({
  root: {},
  content: { overflowY: 'visible' },
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
  daylight: { textDecoration: 'line-through' },
}));

const FINGER = 1.616666;
const POLAR_DISTANCE = {
  Polaris: 3.8548333,
  'χ Dra': 17.5750278,
  Kochab: 13.49038,
};

export default function NavigationDialog(props) {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // const [locale] = React.useContext(LocaleContext);

  function latCalc(altitude, star) {
    const latitude = POLAR_DISTANCE[star] + (star === 'Polaris' ? altitude * FINGER : -altitude * FINGER);
    return `${Math.abs(latitude).toFixed(2)}° ${latitude < 0 ? 'S' : 'N'}`;
  }
  function latError(altitude, star, latitude) {
    const error = POLAR_DISTANCE[star] + (star === 'Polaris' ? altitude * FINGER : -altitude * FINGER) - latitude;
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
        <FormattedMessage id="navigation.title" defaultMessage="Celestial Navigation" />
        <a href="#/navigation" title="Direct Link" className="direct">
          #
        </a>
      </DialogTitle>

      <DialogContent className={classes.content}>
        <h3>Latitude Calculations</h3>
        <p>
          Knowing the position of reference stars in the 1400s (from Stellarium) and the size of a "finger" (from
          antique kamals: 1° 37'), the Mao Kun Map's altitude sights can be converted to latitudes.
        </p>

        <BlockMath math="lat_{calc} = ∂_{decl} + α_{altnpm} * 1.616 \frac{degrees}{finger}" />

        <h4>Known Locations</h4>
        <Table size="small" stickyHeader className={classes.autoWidth}>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Sight</TableCell>
              <TableCell>Altitude (α)</TableCell>
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
                      <TableCell align="right">{latCalc(s.altitude, s.star)}</TableCell>
                      <TableCell align="right">{latError(s.altitude, s.star, s.actual)}</TableCell>
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
                  <TableCell align="right">{/* {latCalc(s.altitude, s.star)} */}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <h3>Stars Used for Altitude Sights</h3>
        <p>
          These stars are sighted with a kamal. Their angular distance from the horizon (altitude) is used to determine
          latitude. Values below are for 1 May, 1422.
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
                <a href="https://en.wikipedia.org/wiki/Polaris" target="_blank" rel="noopener noreferrer">
                  Polaris
                </a>
              </TableCell>
              <TableCell>0h09m46.20s</TableCell>
              <TableCell>+86º08'42.6"</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a href="https://en.wikipedia.org/wiki/Chi_Draconis" target="_blank" rel="noopener noreferrer">
                  χ Dra
                </a>
              </TableCell>
              <TableCell>18h31m19.12s</TableCell>
              <TableCell>+72º25'29.9"</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a href="https://en.wikipedia.org/wiki/Beta_Ursae_Minoris" target="_blank" rel="noopener noreferrer">
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
          These stars are sighted while they are near the horizon. They rise and set in known positions (for a given
          place and season), so they can be used to keep a steady course. Values below (time and azimuth) are for 1 May,
          1422. Starrise values have been calculated with a position at Al Mukalla, Yemen. Starset values have been
          calculated with a position at Sur, Oman.
        </p>

        <BlockMath math="γ_{rise} = \cos^{-1}\frac{\sin ∂_{declination} }{\cos φ_{latitude}}" />
        <Table size="small" stickyHeader className={classes.autoWidth}>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell>Star</TableCell>
              <Tooltip title="Angular distance from the celestial equator in 1422" placement="top">
                <TableCell>Declination</TableCell>
              </Tooltip>
              <Tooltip title="Measured near the Fartak Range, Yemen" placement="top">
                <TableCell>
                  <InlineMath math="γ_{rise}" /> at 16.5º N
                </TableCell>
              </Tooltip>
              <Tooltip title="Measured near Muscat, Oman" placement="top">
                <TableCell>
                  <InlineMath math="γ_{set}" /> at 23.7º N
                </TableCell>
              </Tooltip>
              <Tooltip title="Measured near Qalhat, Oman" placement="top">
                <TableCell>
                  <InlineMath math="γ_{rise}" /> at 6.5º N
                </TableCell>
              </Tooltip>
              <Tooltip title="Measured near the Mudug region, Somalia" placement="top">
                <TableCell>
                  <InlineMath math="γ_{set}" /> at 22.6º N
                </TableCell>
              </Tooltip>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.subheader}>
              <TableCell colSpan={6}>
                <Typography variant="overline" display="block" gutterBottom>
                  Posibilities for "Bùsī" (布司)
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a href="https://en.wikipedia.org/wiki/Pollux_(star)" target="_blank" rel="noopener noreferrer">
                  Pollux
                </a>
              </TableCell>
              <TableCell>+29º 15' 18.2"</TableCell>
              <TableCell className={classes.daylight}>{getAzimuth(29, 15, 18.2, 16.5)}</TableCell>
              <TableCell>{getAzimuth(29, 15, 18.2, 23.7, true)}</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a href="https://en.wikipedia.org/wiki/Procyon" target="_blank" rel="noopener noreferrer">
                  Procyon
                </a>
              </TableCell>
              <TableCell>+6º 32' 58.3"</TableCell>
              <TableCell className={classes.daylight}>TBD</TableCell>
              <TableCell>TBD</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a href="https://en.wikipedia.org/wiki/Beta_Scorpii" target="_blank" rel="noopener noreferrer">
                  Acrab
                </a>
              </TableCell>
              <TableCell>-18º 3' 27.6"</TableCell>
              <TableCell>TBD</TableCell>
              <TableCell className={classes.daylight}>TBD</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a href="https://en.wikipedia.org/wiki/Capella" target="_blank" rel="noopener noreferrer">
                  Capella
                </a>
              </TableCell>
              <TableCell>+45º 10' 27.7"</TableCell>
              <TableCell className={classes.daylight}>TBD</TableCell>
              <TableCell>TBD</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a href="https://en.wikipedia.org/wiki/Beta_Pegasi" target="_blank" rel="noopener noreferrer">
                  Scheat
                </a>
              </TableCell>
              <TableCell>+24º 59' 24.8"</TableCell>
              <TableCell>TBD</TableCell>
              <TableCell className={classes.daylight}>TBD</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
            </TableRow>
            <TableRow className={classes.row}>
              <TableCell>
                <a href="https://en.wikipedia.org/wiki/Fomalhaut" target="_blank" rel="noopener noreferrer">
                  Fomalhaut
                </a>
              </TableCell>
              <TableCell>+32º 37' 13.3"</TableCell>
              <TableCell>TBD</TableCell>
              <TableCell className={classes.daylight}>TBD</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
            </TableRow>

            <TableRow className={classes.subheader}>
              <TableCell colSpan={6}>
                <Typography variant="overline" display="block" gutterBottom>
                  Posibilities for "Dipper" (斗)
                </Typography>
              </TableCell>
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
              <TableCell>+72º 26' 10.5"</TableCell>
              <TableCell>--</TableCell>
              <TableCell>--</TableCell>
              <TableCell>TBD</TableCell>
              <TableCell>TBD</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
