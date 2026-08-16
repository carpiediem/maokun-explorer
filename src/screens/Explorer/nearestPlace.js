// Finds the place whose position on the Mao Kun map is closest to the given [x, y] zoomify
// point, since there's no direct formula mapping Mao Kun coordinates to modern lat/lng.
export default (places, [x, y]) =>
  places
    .filter(({ geometry }) => geometry.type === 'Point' && geometry.zoomify)
    .reduce((closest, place) => {
      const [px, py] = place.geometry.zoomify;
      const distance = (px - x) ** 2 + (py - y) ** 2;
      if (!closest || distance < closest.distance) return { place, distance };
      return closest;
    }, null)?.place;
