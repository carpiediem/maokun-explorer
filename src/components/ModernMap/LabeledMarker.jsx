import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { CircleMarker, Tooltip } from 'react-leaflet';

import toLatLngObject from '../../util/toLatLngObject';

const LabeledMarker = ({ properties, geometry, onSelect, labeled }) => {
  const { locale } = useIntl();
  const className = `circle-marker ${properties.category} id-${properties.id}${
    geometry.zoomify[0] ? '' : ' not-on-mao-kun'
  }`;

  return (
    <CircleMarker
      center={toLatLngObject(geometry.coordinates)}
      radius={5} // props.selected.point === m.properties.id ? 20 : 5
      onClick={() => onSelect(properties.id, 'point', 'modern')}
      className={className}
    >
      {labeled && (
        <Tooltip direction="bottom" offset={[0, -5]} opacity={1} permanent>
          {locale === 'en' ? properties.nameEn : properties.nameTc}
        </Tooltip>
      )}
    </CircleMarker>
  );
};

export default memo(LabeledMarker);
