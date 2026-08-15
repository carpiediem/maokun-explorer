import toLatLngObject from './toLatLngObject';

test('converts a [lng, lat] pair to a { lat, lng } object', () => {
  expect(toLatLngObject([75.75, 11.25])).toEqual({ lat: 11.25, lng: 75.75 });
});
