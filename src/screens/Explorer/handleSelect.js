/* global gtag */

import highlightPath from './highlightPath';

const BOUNDS_MARGIN = 0.08; // degrees latitude or longitude

export default (setSelected, places, paths, modernMapRef) => (
  id,
  type,
  source
) => {
  console.log('handleSelect', id, type, source);

  gtag('event', type === 'point' ? 'place selection' : 'path selection', {
    event_category: 'UX',
    event_label: source,
    value: id,
  });

  Array.from(
    document.querySelectorAll('path.circle-marker, path.path')
  ).forEach((f) => {
    f.classList.remove('selected');
    f.classList.remove('path-landmark');
  });
  Array.from(
    document.querySelectorAll('.modern path.circle-marker, path.path')
  ).forEach((f) =>
    f.setAttribute(
      'd',
      f
        .getAttribute('d')
        .replace(
          /m-\d+,0a\d+,\d+ 0 1,0 \d+,0 a\d+,\d+ 0 1,0 -\d+,0 /,
          'a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 '
        )
    )
  );

  setSelected({ [type]: id });
  if (!id) return;

  switch (type) {
    case 'point':
      const { coordinates, zoomify } = places.find(
        (p) => p.properties.id === id
      ).geometry;

      // Recenter MaoKunMap
      if (source !== 'maokun' && zoomify[0])
        // maokunMapRef.current.leafletElement.flyToBounds(
        //   xyToLeaflet(zoomify, 500),
        //   { paddingBottomRight: [260, 0], paddingTopLeft: [0, 75] }
        // );
        // setMaokunCenter(xyToLeaflet(zoomify));

        // Add `selected` class to CirlceMarker component's <path> element
        Array.from(
          document.querySelectorAll(`path.circle-marker.id-${id}`)
        ).forEach((m) => m.classList.add('selected'));

      // Change marker radius from 5 to 20 in ModernMap
      const modernMarker = document.querySelector(
        `section.modern path.circle-marker.id-${id}`
      );
      if (!modernMarker) return;

      modernMarker.setAttribute(
        'd',
        modernMarker
          .getAttribute('d')
          .replace(
            'a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 ',
            'm-15,0a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 '
          )
      );

      // Recenter ModernMap
      if (source !== 'modern')
        modernMapRef.current.leafletElement.flyToBounds(
          [
            [coordinates[1] - BOUNDS_MARGIN, coordinates[0] - BOUNDS_MARGIN],
            [coordinates[1] + BOUNDS_MARGIN, coordinates[0] + BOUNDS_MARGIN],
          ],

          { paddingBottomRight: [260, 0] }
        );
      break;

    case 'path':
      highlightPath(id, paths, places);

      break;

    default:
  }
};
