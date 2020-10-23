export default function highlightPlace() {
  const { coordinates, zoomify } = places.find(
    (p) => p.properties.id === id
  ).geometry;

  // Recenter MaoKunMap
  if (source !== 'maokun' && zoomify[0])
    maokunMapRef.current.leafletElement.flyToBounds(xyToLeaflet(zoomify, 500), {
      paddingBottomRight: [260, 0],
      paddingTopLeft: [0, 75],
    });
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
}
