const FINGER = 1.616666;
const POLAR_DISTANCE = {
  Polaris: 3.8548333,
  'χ Dra': 17.5750278,
  Kochab: 13.49038,
};

export function latCalc(altitude, star) {
  const latitude = POLAR_DISTANCE[star] + (star === 'Polaris' ? altitude * FINGER : -altitude * FINGER);
  return `${Math.abs(latitude).toFixed(2)}° ${latitude < 0 ? 'S' : 'N'}`;
}

export function latError(altitude, star, latitude) {
  const error = POLAR_DISTANCE[star] + (star === 'Polaris' ? altitude * FINGER : -altitude * FINGER) - latitude;
  return `${error > 0 ? '+' : ''}${error.toFixed(2)}°`;
}
