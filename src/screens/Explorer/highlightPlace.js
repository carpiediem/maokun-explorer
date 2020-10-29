export default (id, index) => {
  const maokunMarker = document.querySelector(
    `section.maokun path.circle-marker.id-${id}`
  );
  const modernMarker = document.querySelector(
    `section.modern path.circle-marker.id-${id}`
  );
  const isLandmark = typeof index === 'number';

  // Add `selected` class to CirlceMarker component's <path> element
  if (maokunMarker)
    maokunMarker.classList.add(isLandmark ? 'path-landmark' : 'selected');
  if (modernMarker)
    modernMarker.classList.add(isLandmark ? 'path-landmark' : 'selected');

  // THIS IS OVERWRITTEN BY LEAFLET'S FLYTO METHOD
  /*
  // Change marker radius from 5 to 10 or 20 in ModernMap
  const oldPath = modernMarker.getAttribute('d');
  const newPath = oldPath.replace(
    'a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 ',
    isLandmark
      ? 'm-5,0a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 '
      : 'm-15,0a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 '
  );

  modernMarker.setAttribute('d', newPath);
*/
};
