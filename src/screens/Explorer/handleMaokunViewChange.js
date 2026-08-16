import inMaokunView from '../../components/MaoKunMap/inMaokunView';
import latlngBoundsReducer from '../../util/latlngBoundsReducer';
import updateFov from '../../components/MiniMap/updateFov';
import FLY_DURATION from '../../components/MaoKunMap/flyDuration';

const WHOLE_GLOBE = [
  [90, 180],
  [-90, -180],
];
const BOUNDS_MARGIN = 0.08; // degrees latitude or longitude
// Buffer beyond the flyToBounds animation's own duration, so the view-change event that fires
// right as the animation settles isn't mistaken for a user-driven pan (see FLY_DURATION).
const SELECTION_SUPPRESS_BUFFER = 0.5;

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
  if (!time || timeSinceSelection > FLY_DURATION + SELECTION_SUPPRESS_BUFFER) {
    modernMapRef.current.leafletElement.fitBounds(boundsWithMargin);
  }
};
