import updateFov from './updateFov';

test('sets the field-of-view rect attributes from Leaflet-style bounds', () => {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  const fovRef = { current: rect };

  updateFov(fovRef, { _southWest: [0.2, 0.7], _northEast: [0.6, 0.3] });

  expect(rect.getAttribute('x')).toBe('20%');
  expect(rect.getAttribute('y')).toBe('30%');
  expect(rect.getAttribute('width')).toBe('40%');
  expect(rect.getAttribute('height')).toBe('40%');
});
