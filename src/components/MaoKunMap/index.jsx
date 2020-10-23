/* eslint-disable react-hooks/exhaustive-deps */

import React, { forwardRef, useEffect } from 'react';
import { CRS } from 'leaflet';
import {
  Map,
  ZoomControl,
  CircleMarker,
  Polyline,
  Tooltip,
} from 'react-leaflet';

import { LocaleContext } from '../../LocaleContext';
import ZoomifyLayer from './ZoomifyLayer';
import xyToLeaflet from '../../util/xyToLeaflet';

import './MaoKunMap.css';

const MAOKUN_URL =
  'https://barbierilow.faculty.history.ucsb.edu/Research/ZhengHeMapZoomify/ZhengHe/';
const MAOKUN_WIDTH = 108401; // (423 * 256) + 113
const MAOKUN_HEIGHT = 4263; // (16 * 256) + 167
const MAOKUN_SIZE = {
  coordinates: { lat: -8.326171875, lng: 211.720703125 },
  zoomify: [108401, 4263],
};
const START_PIXEL = [105513, 1863];
const ATTRIBUTION =
  "<a href='https://en.wikipedia.org/wiki/Wubei_Zhi'>Mao Yuanyi</a> & <a href='https://barbierilow.faculty.history.ucsb.edu/Research/ZhengHeMapZoomify/ZhengHe.htm'>Prof. Anthony Barbieri</a>";

const MaoKunMap = forwardRef((props, ref) => {
  const [zoom] = React.useState(6);
  const [locale] = React.useContext(LocaleContext);

  useEffect(() => {
    ref.current.leafletElement.on('click', (event) => {
      console.log(event);
      if (/leaflet-container/.test(event.originalEvent.path[0].className))
        props.onClick();
    });
  }, []);

  function handleMove(e) {
    const bounds = ref.current.leafletElement.getBounds();

    props.onMove({
      _southWest: [
        (bounds._southWest.lng / MAOKUN_SIZE.coordinates.lng) * MAOKUN_WIDTH,
        (bounds._southWest.lat / MAOKUN_SIZE.coordinates.lat) * MAOKUN_HEIGHT,
      ],
      _northEast: [
        (bounds._northEast.lng / MAOKUN_SIZE.coordinates.lng) * MAOKUN_WIDTH,
        (bounds._northEast.lat / MAOKUN_SIZE.coordinates.lat) * MAOKUN_HEIGHT,
      ],
    });
  }

  const select = (id, type) => (evt) => {
    props.onSelect(id, type, 'maokun');

    // evt.originalEvent.target.classList.add('selected');
  };

  const markers = props.places
    .filter((f) => f.geometry.type === 'Point' && f.geometry.zoomify[0])
    .map((f) => ({
      key: f.properties.id,
      // ref: props.markerRefs.current[f.properties.id].maokun, // -2????
      name: locale === 'en' ? f.properties.nameEn : f.properties.nameTc,
      center: xyToLeaflet(f.geometry.zoomify),
      radius: 20,
      onClick: select(f.properties.id, 'point'),
      className: `circle-marker ${f.properties.category} id-${
        f.properties.id
      } ${f.geometry.coordinates.length ? '' : 'unidentified'}`,
    }));

  const polylines = props.paths
    .filter((f) => f.geometry.type === 'LineString' && f.properties.code.length)
    .map((f) => ({
      key: f.properties.code,
      positions: xyToLeaflet(f.geometry.zoomify),
      onClick: select(f.properties.code, 'path'),
      className: `path ${f.properties.direction} code-${f.properties.code}`,
    }));

  // const center = xyToLeaflet(
  //   props.center
  //     ? [
  //         MAOKUN_SIZE.zoomify[0] * props.center.xRatio,
  //         MAOKUN_SIZE.zoomify[1] * props.center.yRatio,
  //       ]
  //     : START_PIXEL
  // );

  const showMarkers = ref.current && ref.current.leafletElement.getZoom() > 4;

  return (
    <section className="maokun">
      <Map
        ref={ref}
        crs={CRS.Simple}
        center={props.center || xyToLeaflet(START_PIXEL)}
        zoom={zoom}
        onMove={handleMove}
        zoomControl={false}
      >
        <ZoomControl position="topright" />
        <ZoomifyLayer
          attribution={ATTRIBUTION}
          url={MAOKUN_URL}
          width={MAOKUN_WIDTH}
          height={MAOKUN_HEIGHT}
        />
        {showMarkers &&
          markers.map((m) => (
            <CircleMarker {...m}>
              {props.labelLocations && (
                <Tooltip
                  direction="bottom"
                  offset={[0, 10]}
                  opacity={1}
                  permanent
                >
                  {m.name}
                </Tooltip>
              )}
            </CircleMarker>
          ))}

        {polylines.map((p) => (
          <Polyline {...p} />
        ))}
      </Map>
    </section>
  );
});

export default MaoKunMap;
