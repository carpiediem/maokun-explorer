import inMaokunView from '../../components/MaoKunMap/inMaokunView';
import latlngBoundsReducer from '../../util/latlngBoundsReducer';
import updateFov from '../../components/MiniMap/updateFov';

const WHOLE_GLOBE = [
  [90, 180],
  [-90, -180],
];
const BOUNDS_MARGIN = 0.08; // degrees latitude or longitude

export default (modernMapRef, minimapFovRef, filteredPlaces, selected) => (
  percentBounds
) => {
  // Update red "field of view" box in MiniMap
  updateFov(minimapFovRef, percentBounds);

  // Identify bounds of the places visible on the Mao Kun map
  const latlngBounds = filteredPlaces
    .filter(inMaokunView(percentBounds))
    .reduce(latlngBoundsReducer, WHOLE_GLOBE);
  const boundsWithMargin = [
    [latlngBounds[0][0] - BOUNDS_MARGIN, latlngBounds[0][1] - BOUNDS_MARGIN],
    [latlngBounds[1][0] + BOUNDS_MARGIN, latlngBounds[1][1] + BOUNDS_MARGIN],
  ];

  // Update ModernMap (unless triggered by centerOn())
  const timeSinceSelection = (Date.now() - selected.time) / 1000;
  if (!selected.time || timeSinceSelection > 2)
    modernMapRef.current.leafletElement.fitBounds(boundsWithMargin);
};
