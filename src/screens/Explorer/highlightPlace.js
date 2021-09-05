export default (id, index) => {
  const maokunMarker = document.querySelector(`section.maokun path.circle-marker.id-${id}`);
  const modernMarker = document.querySelector(`section.modern path.circle-marker.id-${id}`);
  const isLandmark = typeof index === 'number';

  // Add `selected` class to CirlceMarker component's <path> element
  if (maokunMarker) maokunMarker.classList.add(isLandmark ? 'path-landmark' : 'selected');
  if (modernMarker) modernMarker.classList.add(isLandmark ? 'path-landmark' : 'selected');
};
