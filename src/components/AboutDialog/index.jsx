import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import externalLink from '../externalLink';

export default function AboutDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { locale } = useIntl();

  return (
    <Dialog fullScreen={fullScreen} open={props.open} onClose={props.handleClose} aria-labelledby="about-dialog">
      <DialogTitle>
        {fullScreen && (
          <IconButton onClick={props.handleClose} style={{ marginLeft: -16 }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
        <FormattedMessage id="about.title" defaultMessage="About the Mao Kun Map" />
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
                  : 'https://zh.wikipedia.org/wiki/%E9%84%AD%E5%92%8C',
                props.outlinksDisabled,
              ),
              a2: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Mao_Kun_map'
                  : 'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E8%88%AA%E6%B5%B7%E5%9B%BE',
                props.outlinksDisabled,
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
                  : 'https://zh.wikipedia.org/wiki/%E6%98%8E%E6%88%90%E7%A5%96',
                props.outlinksDisabled,
              ),
              a2: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Yingya_Shenglan'
                  : 'https://zh.wikipedia.org/wiki/%E7%80%9B%E6%B6%AF%E8%83%9C%E8%A7%88',
                props.outlinksDisabled,
              ),
              a3: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Wubei_Zhi'
                  : 'https://zh.wikipedia.org/wiki/%E6%AD%A6%E5%82%99%E5%BF%97',
                props.outlinksDisabled,
              ),
            }}
          />
        </p>
        <p>
          <FormattedMessage id="about.p3" />
        </p>
        <img src="./images/jmmp.jpg" width="100%" alt="Mao Kun Map on 20 A4 pages" />
        <p>
          <FormattedMessage id="about.p4" />
        </p>
        {!props.outlinksDisabled && (
          <table>
            <thead style={{ textAlign: 'left' }}>
              <tr>
                <th>
                  <FormattedMessage id="about.fullData" defaultMessage="Full data set" />
                </th>
                <th>
                  <FormattedMessage id="about.strictData" defaultMessage="Strict GeoJSON Compatibility" />
                </th>
              </tr>
            </thead>
            <tbody style={{ verticalAlign: 'top' }}>
              <tr>
                <td>
                  <ul style={{ padding: '0 18px' }}>
                    <li>
                      <a href="/data/maokun-places.geo.json">maokun-places.geo.json</a>
                    </li>
                    <li>
                      <a href="/data/maokun-paths.geo.json">maokun-paths.geo.json</a>
                    </li>
                    <li>
                      <a href="/data/maokun-places.csv">maokun-places.csv</a>
                    </li>
                    <li>
                      <a href="/data/maokun-rutters.csv">maokun-rutters.csv</a>
                    </li>
                    <li>
                      <a href="/data/maokun-imagePaths.csv">maokun-imagePaths.csv</a>
                    </li>
                    <li>
                      <a href="/data/maokun-geoPaths.csv">maokun-geoPaths.csv</a>
                    </li>
                  </ul>
                </td>
                <td>
                  <ul style={{ padding: '0 18px' }}>
                    <li>
                      <a href="/data/maokun-places-strict.geo.json">maokun-places-strict.geo.json</a>
                    </li>
                    <li>
                      <a href="/data/maokun-paths-strict.geo.json">maokun-paths-strict.geo.json</a>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <p>
          <FormattedMessage
            id="about.p5"
            values={{
              a0: externalLink('http://rslc.us', props.outlinksDisabled),
              a1: externalLink('https://www.history.ucsb.edu/faculty/anthony-barbieri/', props.outlinksDisabled),
              a2: externalLink('http://www.world10k.com/blog/?page_id=192', props.outlinksDisabled),
              a3: externalLink('http://www.world10k.com/world10k.html', props.outlinksDisabled),
              a4: externalLink('http://www.world10k.com/blog/?p=2683', props.outlinksDisabled),
              a5: externalLink('http://www1.geo.ntnu.edu.tw/climate/sihsuframe.html', props.outlinksDisabled),
              a6: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Kamal_(navigation)'
                  : 'https://zh.wikipedia.org/wiki/%E8%BF%87%E6%B4%8B%E7%89%B5%E6%98%9F%E6%9C%AF#%E7%89%B5%E6%98%9F%E6%9D%BF',
                props.outlinksDisabled,
              ),
            }}
          />
        </p>
        <p>
          <FormattedMessage
            id="about.p6"
            values={{
              a7: externalLink('http://ciuhct.org/en/members/jose-manuel-malhao-pereira', props.outlinksDisabled),
              a8: externalLink('https://www.ames.cam.ac.uk/people/dr-sally-church', props.outlinksDisabled),
              a9: externalLink('https://www.reddit.com/r/ChineseLanguage/', props.outlinksDisabled),
            }}
          />
        </p>
        <p>
          <FormattedMessage
            id={props.outlinksDisabled ? 'about.qr' : 'about.p7'}
            values={{
              a1: externalLink('./attribution.txt', props.outlinksDisabled),
            }}
          />
        </p>
        <img
          alt="QR code of this page's URL"
          src="data:image/png;base64,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"
          style={{ display: 'block', margin: '10px auto' }}
        />
      </DialogContent>
    </Dialog>
  );
}
