const ARCLENGTH_OF_FINGER = 1 + 37 / 60; // in degrees
const DECLINATION_POLARIS = 86.204278; // in degrees, as measured in 1432 CE
const DECLINATION_KOCHAB = 76 + 28 / 60 + 0.9 / 360; // in degrees, as measured in 1432 CE

function asLatitude(n, star = "Polaris") {
  let inDegrees;
  switch (star.toLowerCase()) {
    case "kochab":
      inDegrees = n * ARCLENGTH_OF_FINGER + (90 - DECLINATION_KOCHAB);
      break;
    default:
      inDegrees = n * ARCLENGTH_OF_FINGER + (90 - DECLINATION_POLARIS);
  }

  return `${inDegrees.toFixed(2)}° ${inDegrees >= 0 ? "N" : "S"}`;
}

export default asLatitude;
