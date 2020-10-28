import { select } from 'd3-selection';

import path from './path';

export default (bounds) => {
  const coordinates = Array.isArray(bounds)
    ? [
        [bounds[0][1], bounds[0][0]],
        [bounds[0][1], bounds[1][0]],
        [bounds[1][1], bounds[1][0]],
        [bounds[1][1], bounds[0][0]],
        [bounds[0][1], bounds[0][0]],
      ]
    : [
        [bounds._southWest.lng, bounds._southWest.lat],
        [bounds._southWest.lng, bounds._northEast.lat],
        [bounds._northEast.lng, bounds._northEast.lat],
        [bounds._northEast.lng, bounds._southWest.lat],
        [bounds._southWest.lng, bounds._southWest.lat],
      ];

  const collection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
      },
    ],
  };

  select('svg#globe path.field-of-view').datum(collection).attr('d', path);
};
