// Mention the magnetic north pole: different sources mention different locations; moving rapidly over this century
// https://planetearth2017.files.wordpress.com/2012/05/figure-9-the-closer-to-the-magnetic-pole-the-colder-it-gets2.png
// https://www.nasa.gov/sites/default/files/files/SMI_Problem12.pdf

// https://zh.wikipedia.org/zh-hk/%E6%B5%B7%E9%81%93%E9%92%88%E7%BB%8F

import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  IconButton,
} from '@material-ui/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import GlossaryItem from './GlossaryItem.jsx';

export default function GlossaryDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
          <GlossaryItem
            character="千戶所"
            pinyin="qiānhùsuǒ"
            definitionId="glossary.千戶所"
          />
          <GlossaryItem
            character="衛"
            pinyin="wèi"
            definitionId="glossary.衛"
          />
          <GlossaryItem
            character="更"
            pinyin="gèng"
            definitionId="glossary.更"
          />
          <GlossaryItem
            character="針"
            pinyin="zhēn"
            definitionId="glossary.針"
          />
          <GlossaryItem
            character="托"
            pinyin="tuō"
            definitionId="glossary.托"
          />
        </List>
      </DialogContent>
    </Dialog>
  );
}
