import handleModernViewChange from './handleModernViewChange';

afterEach(() => {
  document.body.innerHTML = '';
});

test('updates the globe field-of-view path from the target bounds', () => {
  document.body.innerHTML = '<svg id="globe"><path class="field-of-view"></path></svg>';

  const target = {
    getBounds: () => ({
      _southWest: { lng: 10, lat: 20 },
      _northEast: { lng: 30, lat: 40 },
    }),
  };

  handleModernViewChange({ target });

  const fovPath = document.querySelector('svg#globe path.field-of-view');
  expect(fovPath.getAttribute('d')).toEqual(expect.stringMatching(/^M/));
});
