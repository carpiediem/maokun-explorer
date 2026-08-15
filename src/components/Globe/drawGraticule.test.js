import drawGraticule from './drawGraticule';

beforeEach(() => {
  document.body.innerHTML = '<svg id="globe"><g class="graticule"></g></svg>';
});

test('appends a graticule path to the graticule group', () => {
  drawGraticule();

  const graticulePath = document.querySelector('svg#globe g.graticule path.graticule');
  expect(graticulePath).not.toBeNull();
  expect(graticulePath.getAttribute('d')).toEqual(expect.stringMatching(/^M/));
  expect(graticulePath.style.fill).toBe('#fff');
  expect(graticulePath.style.stroke).toBe('#ccc');
});
