jest.mock('./zoomify-download', () => jest.fn());

test('kicks off a Zoomify download of the Mao Kun map tiles', () => {
  const zoomifyDownload = require('./zoomify-download');

  require('./download-tiles');

  expect(zoomifyDownload).toHaveBeenCalledWith(
    'https://barbierilow.faculty.history.ucsb.edu/Research/ZhengHeMapZoomify/ZhengHe/',
    './tiles',
  );
});
