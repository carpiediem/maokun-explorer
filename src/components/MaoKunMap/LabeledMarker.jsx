import React from 'react';
import { useIntl } from 'react-intl';
import { CircleMarker, Tooltip } from 'react-leaflet';

import xyToLeaflet from './xyToLeaflet';

export default ({ properties, geometry, onSelect, labeled }) => {
  const { locale } = useIntl();
  const className = `circle-marker ${properties.category} id-${properties.id} ${
    geometry.coordinates.length ? '' : 'unidentified'
  }`;

  return (
    <CircleMarker
      center={xyToLeaflet(geometry.zoomify)}
      radius={20}
      onClick={() => onSelect(properties.id, 'point', 'maokun')}
      className={className}
    >
      {labeled && (
        <Tooltip direction="bottom" offset={[0, 10]} opacity={1} permanent>
          {locale === 'en' ? properties.nameEn : properties.nameTc}
        </Tooltip>
      )}
    </CircleMarker>
  );
};
