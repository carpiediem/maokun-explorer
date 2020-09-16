import React, { useRef } from 'react';
import { CRS } from 'leaflet';
import { Map, ZoomControl, Marker } from 'react-leaflet';
import { identified, unidentified, unknown } from './icons';

import ZoomifyLayer from './ZoomifyLayer';

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

  function toLatLng([x, y]) {
    return {
      lat: (y / MAOKUN_HEIGHT) * MAOKUN_SIZE.coordinates.lat, // map.current.edges.lat
      lng: (x / MAOKUN_WIDTH) * MAOKUN_SIZE.coordinates.lng, // map.current.edges.lng
    };
  }

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

  const markers = props.geojson.features
    .filter((m) => m.geometry.type === 'Point')
    .map((m) => ({
      key: m.properties.id,
      icon:
        (m.geometry.coordinates.length ? identified : unidentified)[
          m.properties.category
        ] || unknown,
      position: toLatLng(m.geometry.zoomify),
      onClick: () => props.onSelect(m.properties.id, 'point'),
    }));

  const center = toLatLng(
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
        {showMarkers && markers.map((m) => <Marker {...m} />)}
      </Map>
    </section>
  );
}

export default MaoKunMap;
