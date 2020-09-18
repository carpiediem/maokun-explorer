import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import externalLink from '../externalLink';

export default function AboutDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="about-dialog-title"
    >
      <DialogTitle>
        {fullScreen && (
          <IconButton onClick={props.handleClose}>
            <ChevronLeftIcon />
          </IconButton>
        )}
        <FormattedMessage
          id="about.title"
          defaultMessage="About the Mao Kun Map"
        />
        <a href="#/about" title="Direct Link" className="direct">
          #
        </a>
      </DialogTitle>

      <DialogContent>
        <p>
          <FormattedMessage
            id="about.p1"
            values={{
              a1: externalLink('https://en.wikipedia.org/wiki/Zheng_He'),
              a2: externalLink('https://en.wikipedia.org/wiki/Mao_Kun_map'),
            }}
          />
        </p>
        <p>
          <FormattedMessage
            id="about.p2"
            values={{
              a1: externalLink('https://en.wikipedia.org/wiki/Yongle_Emperor'),
              a2: externalLink('https://en.wikipedia.org/wiki/Yingya_Shenglan'),
              a3: externalLink('https://en.wikipedia.org/wiki/Wubei_Zhi'),
            }}
          />
        </p>
        <p>
          <FormattedMessage id="about.p3" />
        </p>
        <img src="./jmmp.jpg" width="100%" alt="Mao Kun Map on 20 A4 pages" />
        <p>
          <FormattedMessage
            id="about.p4"
            values={{
              a1: externalLink('./maokun.csv'),
              a2: externalLink('./maokun.geo.json'),
              a3: externalLink('./maokun-known.geo.json'),
            }}
          />
        </p>
        <table>
          <thead style={{ textAlign: 'left' }}>
            <tr>
              <th>Full data set</th>
              <th>Strict GeoJSON Compatability</th>
            </tr>
          </thead>
          <tbody style={{ verticalAlign: 'top' }}>
            <tr>
              <td>
                <ul style={{ padding: '0 18px' }}>
                  <li>
                    <a href="/data/maokun-places.geo.json">
                      maokun-places.geo.json
                    </a>
                  </li>
                  <li>
                    <a href="/data/maokun-paths.geo.json">
                      maokun-paths.geo.json
                    </a>
                  </li>
                  <li>
                    <a href="/data/maokun-places.csv">maokun-places.csv</a>
                  </li>
                  <li>
                    <a href="/data/maokun-rutters.csv">maokun-rutters.csv</a>
                  </li>
                  <li>
                    <a href="/data/maokun-imagePaths.csv">
                      maokun-imagePaths.csv
                    </a>
                  </li>
                  <li>
                    <a href="/data/maokun-geoPaths.csv">maokun-geoPaths.csv</a>
                  </li>
                </ul>
              </td>
              <td>
                <ul style={{ padding: '0 18px' }}>
                  <li>
                    <a href="/data/maokun-places-strict.geo.json">
                      maokun-places-strict.geo.json
                    </a>
                  </li>
                  <li>
                    <a href="/data/maokun-paths-strict.geo.json">
                      maokun-paths-strict.geo.json
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <FormattedMessage
            id="about.p5"
            values={{
              a0: externalLink('http://rslc.us'),
              a1: externalLink(
                'https://www.history.ucsb.edu/faculty/anthony-barbieri/'
              ),
              a2: externalLink('http://www.world10k.com/blog/?page_id=192'),
              a3: externalLink('http://www.world10k.com/world10k.html'),
              a4: externalLink('http://www.world10k.com/blog/?p=2683'),
              a5: externalLink(
                'http://www1.geo.ntnu.edu.tw/climate/sihsuframe.html'
              ),
              a6: externalLink(
                'https://en.wikipedia.org/wiki/Kamal_(navigation)'
              ),
              a7: externalLink(
                'http://ciuhct.org/en/members/jose-manuel-malhao-pereira'
              ),
              a8: externalLink(
                'https://www.ames.cam.ac.uk/people/dr-sally-church'
              ),
              a9: externalLink('https://www.reddit.com/r/ChineseLanguage/'),
            }}
          />
        </p>
        <p>
          <FormattedMessage
            id="about.p6"
            values={{
              a1: externalLink('https://www.flaticon.com/authors/freepik'),
              a2: externalLink('https://www.flaticon.com/'),
              a3: externalLink('./attribution.txt'),
            }}
          />
        </p>
      </DialogContent>
    </Dialog>
  );
}
