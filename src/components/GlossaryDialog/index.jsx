// https://books.taipei/api/publication/downloadPublication?id=ed506d85-f78d-4217-ba39-43480661a7ac&rid=06290eb1-2525-4805-9fdb-f7b0b3a73aa9
// https://en.wikipedia.org/wiki/Chinese_star_names#Categories_of_Chinese_traditional_uranography

import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListSubheader,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { LocaleContext } from '../../LocaleContext';
import GlossaryItem from './GlossaryItem.jsx';
import externalLink from '../externalLink';

const useStyles = makeStyles((theme) => ({
  root: {},
  subHeader: { backgroundColor: 'white', top: -8 },
}));

export default function GlossaryDialog(props) {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [locale] = React.useContext(LocaleContext);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="glossary-dialog-title"
    >
      <DialogTitle>
        {fullScreen && (
          <IconButton onClick={props.handleClose}>
            <ChevronLeftIcon />
          </IconButton>
        )}
        <FormattedMessage id="glossary.title" defaultMessage="Glossary" />
        <a href="#/glossary" title="Direct Link" className="direct">
          #
        </a>
      </DialogTitle>

      <DialogContent>
        <List>
          <ListSubheader className={classes.subHeader}>
            Ming Government Organization
          </ListSubheader>
          <GlossaryItem
            character="衛"
            pinyin="wèi"
            definitionId="glossary.衛"
            values={{
              a1: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Military_of_the_Ming_dynasty#Guard_battalion_system'
                  : 'https://zh.wikipedia.org/wiki/%E8%A1%9B%E6%89%80%E5%88%B6'
              ),
            }}
          />
          <GlossaryItem
            character="千戶所"
            pinyin="qiānhùsuǒ"
            definitionId="glossary.千戶所"
          />

          <ListSubheader className={classes.subHeader}>
            Navigation
          </ListSubheader>
          <GlossaryItem
            character="更"
            pinyin="gèng"
            definitionId="glossary.更"
          />
          <GlossaryItem
            character="針"
            pinyin="zhēn"
            definitionId="glossary.針"
            values={{
              a1: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Points_of_the_compass#Chinese_compass_points'
                  : 'https://zh.wikipedia.org/zh-hk/%E6%B5%B7%E9%81%93%E9%92%88%E7%BB%8F'
              ),
              a2: externalLink(
                'https://www.nasa.gov/sites/default/files/files/SMI_Problem12.pdf'
              ),
            }}
          />
          <GlossaryItem
            character="托"
            pinyin="tuō"
            definitionId="glossary.托"
          />
          <GlossaryItem
            character="指"
            pinyin="zhǐ"
            definitionId="glossary.指"
            values={{
              a1: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Kamal_(navigation)'
                  : 'https://zh.wikipedia.org/wiki/%E8%BF%87%E6%B4%8B%E7%89%B5%E6%98%9F%E6%9C%AF#%E7%89%B5%E6%98%9F%E6%9D%BF'
              ),
            }}
          />
          <GlossaryItem
            character="角"
            pinyin="jiǎo"
            definitionId="glossary.角"
          />

          <ListSubheader className={classes.subHeader}>Stars</ListSubheader>
          <GlossaryItem
            character="北辰"
            pinyin="Běichén"
            definitionId="glossary.北辰"
            values={{
              a1: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Polaris'
                  : 'https://zh.wikipedia.org/wiki/%E5%8B%BE%E9%99%B3%E4%B8%80'
              ),
              a2: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Axial_precession'
                  : 'https://zh.wikipedia.org/wiki/%E6%AD%B2%E5%B7%AE'
              ),
            }}
          />
          <GlossaryItem
            character="華蓋"
            pinyin="Huágài"
            definitionId="glossary.華蓋"
            values={{
              a1: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Cassiopeia_in_Chinese_astronomy'
                  : 'https://zh.wikipedia.org/wiki/%E8%8F%AF%E8%93%8B_(%E6%98%9F%E5%AE%98)'
              ),
              a2: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Chi_Draconis'
                  : 'https://zh.wikipedia.org/wiki/%E5%BE%A1%E5%A5%B3%E5%9B%9B'
              ),
              a3: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Beta_Ursae_Minoris'
                  : 'https://zh.wikipedia.org/wiki/%E5%8C%97%E6%A5%B5%E4%BA%8C'
              ),
            }}
          />
          <GlossaryItem
            character="布司"
            pinyin="Bùsī"
            definitionId="glossary.布司"
            values={{
              a1: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Pollux_(star)'
                  : 'https://zh.wikipedia.org/wiki/%E5%8C%97%E6%B2%B3%E4%B8%89'
              ),
              a2: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Procyon'
                  : 'https://zh.wikipedia.org/wiki/%E5%8D%97%E6%B2%B3%E4%B8%89'
              ),
              a3: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Beta_Scorpii'
                  : 'https://zh.wikipedia.org/wiki/%E6%88%BF%E5%AE%BF%E5%9B%9B'
              ),
              a4: externalLink(
                locale === 'en'
                  ? 'https://en.wikipedia.org/wiki/Capella'
                  : 'https://zh.wikipedia.org/wiki/%E4%BA%94%E8%BB%8A%E4%BA%8C'
              ),
            }}
          />
        </List>
      </DialogContent>
    </Dialog>
  );
}
