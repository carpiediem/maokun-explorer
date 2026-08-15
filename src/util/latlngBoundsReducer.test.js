import latlngBoundsReducer from './latlngBoundsReducer';

function feature(lat, lng) {
  return { geometry: { coordinates: [lng, lat] } };
}

test('expands the bounds to include the current feature', () => {
  const bounds = [
    [10, 10],
    [20, 20],
  ];

  expect(latlngBoundsReducer(bounds, feature(5, 25))).toEqual([
    [5, 10],
    [20, 25],
  ]);
});

test('leaves the bounds unchanged when the feature is already within them', () => {
  const bounds = [
    [10, 10],
    [20, 20],
  ];

  expect(latlngBoundsReducer(bounds, feature(15, 15))).toEqual(bounds);
});
