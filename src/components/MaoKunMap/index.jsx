import React, { forwardRef } from 'react';
import { CRS } from 'leaflet';
import { Map, ZoomControl, Polyline } from 'react-leaflet';

import ZoomifyLayer from './ZoomifyLayer';
import LabeledMarker from './LabeledMarker';

import leafletClickListener from './leafletClickListener';
import leafletViewListener from './leafletViewListener';
// import getPercentageBounds from './getPercentageBounds';
import xyToLeaflet from '../../util/xyToLeaflet';
import MAOKUN_SIZE from './size';
import './MaoKunMap.css';

const MAOKUN_URL =
  'https://barbierilow.faculty.history.ucsb.edu/Research/ZhengHeMapZoomify/ZhengHe/';
const ATTRIBUTION =
  "<a href='https://en.wikipedia.org/wiki/Wubei_Zhi'>Mao Yuanyi</a> & <a href='https://barbierilow.faculty.history.ucsb.edu/Research/ZhengHeMapZoomify/ZhengHe.htm'>Prof. Anthony Barbieri</a>";

const onZoomifyMap = (f) =>
  (f.geometry.type === 'Point' && f.geometry.zoomify[0]) ||
  (f.geometry.type === 'LineString' && f.properties.code.length);

const MaoKunMap = forwardRef(
  ({ places, paths, labelLocations, onSelect, onViewChange }, mapRef) => {
    return (
      <section className="maokun">
        <Map
          ref={mapRef}
          crs={CRS.Simple}
          center={[
            MAOKUN_SIZE.coordinates.lat / 2,
            MAOKUN_SIZE.coordinates.lng / 2,
          ]}
          zoom={3}
          // onMove={() => onViewChange(getPercentageBounds(mapRef))}
          onMove={leafletViewListener(onViewChange)}
          onZoomend={leafletViewListener(onViewChange)}
          onClick={leafletClickListener(onSelect)}
          zoomControl={false}
          className={'zoomed-out'}
        >
          <ZoomControl position="topright" />
          <ZoomifyLayer
            attribution={ATTRIBUTION}
            url={MAOKUN_URL}
            width={MAOKUN_SIZE.zoomify[0]}
            height={MAOKUN_SIZE.zoomify[1]}
          />
          {places.filter(onZoomifyMap).map((f) => (
            <LabeledMarker
              key={f.properties.id}
              labeled={labelLocations}
              onSelect={onSelect}
              {...f}
            />
          ))}
          {paths.filter(onZoomifyMap).map((f) => (
            <Polyline
              key={f.properties.code}
              positions={xyToLeaflet(f.geometry.zoomify)}
              onClick={() => onSelect(f.properties.code, 'path', 'maokun')}
              className={`path ${f.properties.direction} code-${f.properties.code}`}
            />
          ))}
        </Map>
      </section>
    );
  }
);

export default MaoKunMap;
