import { select } from 'd3-selection';

import path from './path';

export default function drawFov({ _southWest, _northEast }) {
  const collection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [_southWest.lng, _southWest.lat],
            [_southWest.lng, _northEast.lat],
            [_northEast.lng, _northEast.lat],
            [_northEast.lng, _southWest.lat],
            [_southWest.lng, _southWest.lat],
          ],
        },
      },
    ],
  };

  select('svg#globe path.field-of-view').datum(collection).attr('d', path);
}
