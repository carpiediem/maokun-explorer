import inMaokunView from '../../components/MaoKunMap/inMaokunView';
import latlngBoundsReducer from '../../util/latlngBoundsReducer';
import updateBounds from '../../components/Globe/updateBounds';

const WHOLE_GLOBE = [
  [90, 180],
  [-90, -180],
];
const BOUNDS_MARGIN = 0.08; // degrees latitude or longitude

export default (modernMapRef, filteredPlaces, setPercentBounds) => (
  percentBounds,
  event
) => {
  // Update red box in MiniMap
  setPercentBounds(percentBounds);

  // Identify bounds of the places visible on the Mao Kun map
  const latlngBounds = filteredPlaces
    .filter(inMaokunView(percentBounds))
    .reduce(latlngBoundsReducer, WHOLE_GLOBE);
  const boundsWithMargin = [
    [latlngBounds[0][0] - BOUNDS_MARGIN, latlngBounds[0][1] - BOUNDS_MARGIN],
    [latlngBounds[1][0] + BOUNDS_MARGIN, latlngBounds[1][1] + BOUNDS_MARGIN],
  ];

  // Update ModernMap
  modernMapRef.current.leafletElement.fitBounds(boundsWithMargin);

  // Update red box in Globe
  updateBounds(boundsWithMargin);
};
