import centerMaoKun from '../components/MaoKunMap/centerOn';
import centerModern from '../components/ModernMap/centerOn';

export default (places, paths, maokunMapRef, modernMapRef) => {
  const hashMatch =
    /#\/(place|path)\/([\d\w-]+)/.exec(window.location.hash) || [];
  let toSelect = {};
  let found = null;

  switch (hashMatch[1]) {
    case 'place':
      // zoom to the specified place
      toSelect = { point: parseInt(hashMatch[2], 10) };
      found = places.find((p) => p.properties.id === toSelect.point);
      break;

    case 'paths':
      // zoom to the bounds of the specified path
      toSelect = { paths: hashMatch[2] };
      found = paths.find((p) => p.properties.code === toSelect.path);
      break;

    case undefined:
      // delay zoom until IntroDialog is closed
      break;

    default:
      found = places.find((p) => p.properties.id === 17); // Ming Palace in Nanjing
  }

  if (found) {
    centerMaoKun(maokunMapRef, found.geometry.zoomify);
    centerModern(modernMapRef, found.geometry.coordinates);
  }
  return toSelect;
};
