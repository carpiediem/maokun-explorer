import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const { locale } = useIntl();

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="about-dialog-title"
    >
      <DialogTitle>
        {fullScreen && (
          <IconButton onClick={props.handleClose} style={{ marginLeft: -16 }}>
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
              a1: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Zheng_He'
                  : 'https://zh.wikipedia.org/wiki/%E9%84%AD%E5%92%8C'
              ),
              a2: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Mao_Kun_map'
                  : 'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E8%88%AA%E6%B5%B7%E5%9B%BE'
              ),
            }}
          />
        </p>
        <p>
          <FormattedMessage
            id="about.p2"
            values={{
              a1: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Yongle_Emperor'
                  : 'https://zh.wikipedia.org/wiki/%E6%98%8E%E6%88%90%E7%A5%96'
              ),
              a2: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Yingya_Shenglan'
                  : 'https://zh.wikipedia.org/wiki/%E7%80%9B%E6%B6%AF%E8%83%9C%E8%A7%88'
              ),
              a3: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Wubei_Zhi'
                  : 'https://zh.wikipedia.org/wiki/%E6%AD%A6%E5%82%99%E5%BF%97'
              ),
            }}
          />
        </p>
        <p>
          <FormattedMessage id="about.p3" />
        </p>
        <img src="./jmmp.jpg" width="100%" alt="Mao Kun Map on 20 A4 pages" />
        <p>
          <FormattedMessage id="about.p4" />
        </p>
        <table>
          <thead style={{ textAlign: 'left' }}>
            <tr>
              <th>
                <FormattedMessage
                  id="about.fullData"
                  defaultMessage="Full data set"
                />
              </th>
              <th>
                <FormattedMessage
                  id="about.strictData"
                  defaultMessage="Strict GeoJSON Compatibility"
                />
              </th>
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
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Kamal_(navigation)'
                  : 'https://zh.wikipedia.org/wiki/%E8%BF%87%E6%B4%8B%E7%89%B5%E6%98%9F%E6%9C%AF#%E7%89%B5%E6%98%9F%E6%9D%BF'
              ),
            }}
          />
        </p>
        <p>
          <FormattedMessage
            id="about.p6"
            values={{
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
            id="about.p7"
            values={{
              a1: externalLink('./attribution.txt'),
            }}
          />
        </p>
      </DialogContent>
    </Dialog>
  );
}
