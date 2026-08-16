import inMaokunView from '../../components/MaoKunMap/inMaokunView';
import latlngBoundsReducer from '../../util/latlngBoundsReducer';
import updateFov from '../../components/MiniMap/updateFov';

const WHOLE_GLOBE = [
  [90, 180],
  [-90, -180],
];
const BOUNDS_MARGIN = 0.08; // degrees latitude or longitude

export default (modernMapRef, minimapFovRef, filteredPlaces, selectedRef) => (percentBounds) => {
  // Update red "field of view" box in MiniMap
  updateFov(minimapFovRef, percentBounds);

  // Identify bounds of the places visible on the Mao Kun map
  const latlngBounds = filteredPlaces.filter(inMaokunView(percentBounds)).reduce(latlngBoundsReducer, WHOLE_GLOBE);
  const boundsWithMargin = [
    [latlngBounds[0][0] - BOUNDS_MARGIN, latlngBounds[0][1] - BOUNDS_MARGIN],
    [latlngBounds[1][0] + BOUNDS_MARGIN, latlngBounds[1][1] + BOUNDS_MARGIN],
  ];

  // Update ModernMap (unless triggered by centerOn())
  // Read from a ref, not a closed-over value, since MaoKunMap is memoized and this
  // handler's closure is created once and never refreshed on re-render.
  const { time } = selectedRef.current;
  const timeSinceSelection = (Date.now() - time) / 1000;
  if (!time || timeSinceSelection > 2) modernMapRef.current.leafletElement.fitBounds(boundsWithMargin);
};
