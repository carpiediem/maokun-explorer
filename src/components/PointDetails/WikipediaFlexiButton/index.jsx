import React, { useState, useRef } from 'react';
import { useIntl } from 'react-intl';

import MenuButtons from './MenuButtons';
import WikipediaIcon from './WikipediaIcon';
import CardAction from '../CardAction';
import LinksPopper from './LinksPopper';

function WikipediaFlexiButton({ wikiEn, wikiZh }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { locale } = useIntl();

  if (!wikiEn && !wikiZh) return null;
  if (!(wikiEn && wikiZh))
    return (
      <CardAction
        href={wikiEn || wikiZh}
        icon={<WikipediaIcon />}
        messageId="details.wiki"
        defaultMessage="View wiki"
      />
    );

  const options = [
    { text: 'English Wikipedia', href: wikiEn },
    { text: '中文維基百科', href: wikiZh },
  ];

  return (
    <React.Fragment>
      <MenuButtons
        anchorRef={anchorRef}
        open={open}
        setOpen={setOpen}
        href={locale === 'en' ? wikiEn : wikiZh}
      />
      <LinksPopper
        anchorRef={anchorRef}
        open={open}
        setOpen={setOpen}
        // handleClose={handleClose}
        options={options}
      />
    </React.Fragment>
  );
}

export default WikipediaFlexiButton;
