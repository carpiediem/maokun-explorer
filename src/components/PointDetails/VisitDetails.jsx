import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Typography } from '@material-ui/core';

const YEARS = [
  '1405-07',
  '1407-09',
  '1409-11',
  '1413-15',
  '1416-19',
  '1421-22',
  '1431-33',
];
const URLS = {
  en: [
    'https://en.wikipedia.org/wiki/Ming_treasure_voyages#First_voyage',
    'https://en.wikipedia.org/wiki/Ming_treasure_voyages#Second_voyage',
    'https://en.wikipedia.org/wiki/Ming_treasure_voyages#Third_voyage',
    'https://en.wikipedia.org/wiki/Ming_treasure_voyages#Fourth_voyage',
    'https://en.wikipedia.org/wiki/Ming_treasure_voyages#Fifth_voyage',
    'https://en.wikipedia.org/wiki/Ming_treasure_voyages#Sixth_voyage',
    'https://en.wikipedia.org/wiki/Ming_treasure_voyages#Seventh_voyage',
  ],
  zh: [
    'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E4%B8%8B%E8%A5%BF%E6%B4%8B#%E7%AC%AC%E4%B8%80%E6%AC%A1%E4%B8%8B%E8%A5%BF%E6%B4%8B',
    'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E4%B8%8B%E8%A5%BF%E6%B4%8B#%E7%AC%AC%E4%BA%8C%E6%AC%A1%E4%B8%8B%E8%A5%BF%E6%B4%8B',
    'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E4%B8%8B%E8%A5%BF%E6%B4%8B#%E7%AC%AC%E4%B8%89%E6%AC%A1%E4%B8%8B%E8%A5%BF%E6%B4%8B',
    'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E4%B8%8B%E8%A5%BF%E6%B4%8B#%E7%AC%AC%E5%9B%9B%E6%AC%A1%E4%B8%8B%E8%A5%BF%E6%B4%8B',
    'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E4%B8%8B%E8%A5%BF%E6%B4%8B#%E7%AC%AC%E4%BA%94%E6%AC%A1%E4%B8%8B%E8%A5%BF%E6%B4%8B',
    'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E4%B8%8B%E8%A5%BF%E6%B4%8B#%E7%AC%AC%E5%85%AD%E6%AC%A1%E4%B8%8B%E8%A5%BF%E6%B4%8B',
    'https://zh.wikipedia.org/wiki/%E9%83%91%E5%92%8C%E4%B8%8B%E8%A5%BF%E6%B4%8B#%E7%AC%AC%E4%B8%83%E6%AC%A1%E4%B8%8B%E8%A5%BF%E6%B4%8B',
  ],
};

export default function VisitDetails({ voyages }) {
  const { locale } = useIntl();

  if (!voyages || voyages.length === 0) return null;

  console.log(voyages);

  return (
    <div>
      <Typography color="textSecondary" component="p">
        <FormattedMessage
          id="details.visited"
          defaultMessage="Visited by Treasure-Ships"
        />
      </Typography>
      <Typography variant="caption" component="p">
        {voyages.map((v, i) => (
          <React.Fragment key={v}>
            {i ? ', ' : ''}
            <a
              href={URLS[locale][v - 1]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {YEARS[v - 1]}
            </a>
          </React.Fragment>
        ))}
      </Typography>
    </div>
  );
}
