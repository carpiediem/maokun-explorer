import React, { useRef } from 'react';
import { CRS } from 'leaflet';
import {
  Map,
  ZoomControl,
  CircleMarker,
  Polyline,
  Tooltip,
} from 'react-leaflet';
// import { identified, unidentified, unknown } from './icons';

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

function MaoKunMap(props) {
  const map = useRef(null);
  const [zoom] = React.useState(6);
  const [locale] = React.useContext(LocaleContext);

  function handleMove(e) {
    const bounds = map.current.leafletElement.getBounds();

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
    props.onSelect(id, type);

    evt.originalEvent.target.classList.add('selected');
  };

  const markers = props.places
    .filter((f) => f.geometry.type === 'Point')
    .map((f) => ({
      key: f.properties.id,
      name: locale === 'en' ? f.properties.nameEn : f.properties.nameTc,
      // icon:
      //   (f.geometry.coordinates.length ? identified : unidentified)[
      //     f.properties.category
      //   ] || unknown,
      // position: xyToLeaflet(f.geometry.zoomify),
      center: xyToLeaflet(f.geometry.zoomify),
      radius: 20,
      onClick: select(f.properties.id, 'point'),
      selected: props.selected.point === f.properties.id,
      className: 'circle-marker',
    }));

  const polylines = props.paths
    .filter((f) => f.geometry.type === 'LineString' && f.properties.code.length)
    .map((f) => ({
      key: f.properties.code,
      positions: xyToLeaflet(f.geometry.zoomify),
      onClick: select(f.properties.code, 'path'),
      className: 'path',
    }));

  const center = xyToLeaflet(
    props.center
      ? [
          MAOKUN_SIZE.zoomify[0] * props.center.xRatio,
          MAOKUN_SIZE.zoomify[1] * props.center.yRatio,
        ]
      : START_PIXEL
  );

  const showMarkers = map.current && map.current.leafletElement.getZoom() > 4;

  return (
    <section className="maokun">
      <Map
        ref={map}
        crs={CRS.Simple}
        center={center}
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

        {showMarkers && polylines.map((p) => <Polyline {...p} />)}
      </Map>
    </section>
  );
}

export default MaoKunMap;
