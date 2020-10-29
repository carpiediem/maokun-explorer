/* global gtag */

import resetHighlights from './resetHighlights';
import highlightPlace from './highlightPlace';
import maokunCenterOn from '../../components/MaoKunMap/centerOn';
import modernCenterOn from '../../components/ModernMap/centerOn';

export default (setSelected, { places, paths }, maokunMapRef, modernMapRef) => (
  id,
  type,
  source
) => {
  resetHighlights();
  setSelected({ [type]: id, time: Date.now() });
  if (!id) return;

  // Find feature
  const feature =
    type === 'point'
      ? places.find((f) => f.properties.id === id)
      : paths.find((p) => p.properties.code === id);

  // Change marker styling
  switch (type) {
    case 'point':
      highlightPlace(id);
      break;

    case 'path':
      feature.properties.landmarks.forEach(highlightPlace);
      break;

    default:
  }

  // FlyTo on opposite map
  switch (source) {
    case 'maokun':
      modernCenterOn(modernMapRef, feature.geometry.coordinates);
      break;

    case 'modern':
      maokunCenterOn(maokunMapRef, feature.geometry.zoomify);
      break;

    default:
  }

  // Report event
  gtag('event', type === 'point' ? 'place selection' : 'path selection', {
    event_category: 'UX',
    event_label: source,
    value: id,
  });
};
