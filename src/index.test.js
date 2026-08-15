jest.mock('react-dom', () => ({ render: jest.fn() }));
jest.mock('./App', () => () => null);
jest.mock('./serviceWorker', () => ({ unregister: jest.fn() }));

const ReactDOM = require('react-dom');
const serviceWorker = require('./serviceWorker');

test('renders App (wrapped in the locale context provider) into #root, and unregisters the service worker', () => {
  document.body.innerHTML = '<div id="root"></div>';

  require('./index');

  expect(ReactDOM.render).toHaveBeenCalledWith(expect.anything(), document.getElementById('root'));
  expect(serviceWorker.unregister).toHaveBeenCalled();
});
