function flush(times = 3) {
  return Array.from({ length: times }).reduce(
    (p) => p.then(() => new Promise((resolve) => setTimeout(resolve, 0))),
    Promise.resolve(),
  );
}

// serviceWorker.js's `isLocalhost` is computed once, at import time, from
// window.location.hostname, so the hostname must be set before each fresh require.
function loadFresh() {
  jest.resetModules();
  // eslint-disable-next-line global-require
  return require('./serviceWorker');
}

// jsdom's real Location object rejects direct hostname mutation (it attempts real navigation,
// which isn't implemented) and makes `reload` non-configurable, so it can't be spied on. Replace
// window.location entirely with a plain, fully mutable stand-in instead.
// Every call to register() adds a new 'load' listener to the shared jsdom `window`, and nothing
// in serviceWorker.js ever removes it. Dispatching a real 'load' event would re-trigger every
// listener left over from earlier tests (with their now-stale mocks), so instead capture and
// invoke only the listener this specific register() call adds.
function triggerLoad(register, config) {
  let loadCallback;
  const spy = jest.spyOn(window, 'addEventListener').mockImplementation((event, cb) => {
    if (event === 'load') loadCallback = cb;
  });
  register(config);
  spy.mockRestore();
  loadCallback();
}

function setHostname(hostname) {
  delete window.location;
  window.location = {
    hostname,
    href: `http://${hostname}/`,
    origin: `http://${hostname}`,
    reload: jest.fn(),
  };
}

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
const ORIGINAL_PUBLIC_URL = process.env.PUBLIC_URL;
const ORIGINAL_LOCATION = window.location;

beforeEach(() => {
  process.env.NODE_ENV = 'production';
  process.env.PUBLIC_URL = '';
  setHostname('example.com');
  delete navigator.serviceWorker;
  delete global.fetch;
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  process.env.PUBLIC_URL = ORIGINAL_PUBLIC_URL;
  delete window.location;
  window.location = ORIGINAL_LOCATION;
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('isLocalhost', () => {
  test('hostname "localhost" is treated as localhost (checks for an existing service worker)', async () => {
    setHostname('localhost');
    navigator.serviceWorker = { ready: Promise.resolve({}) };
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, headers: { get: () => 'text/javascript' } }));

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(global.fetch).toHaveBeenCalled();
  });

  test('hostname "[::1]" (IPv6 localhost) is treated as localhost', async () => {
    setHostname('[::1]');
    navigator.serviceWorker = { ready: Promise.resolve({}) };
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, headers: { get: () => 'text/javascript' } }));

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(global.fetch).toHaveBeenCalled();
  });

  test('a 127.0.0.0/8 hostname is treated as localhost', async () => {
    setHostname('127.0.0.1');
    navigator.serviceWorker = { ready: Promise.resolve({}) };
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, headers: { get: () => 'text/javascript' } }));

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(global.fetch).toHaveBeenCalled();
  });

  test('any other hostname is not treated as localhost (registers directly)', async () => {
    setHostname('example.com');
    navigator.serviceWorker = { register: jest.fn(() => Promise.resolve({ installing: null })) };

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(navigator.serviceWorker.register).toHaveBeenCalled();
    expect(global.fetch).toBeUndefined();
  });
});

describe('register', () => {
  test('does nothing when NODE_ENV is not production', () => {
    process.env.NODE_ENV = 'development';
    navigator.serviceWorker = { register: jest.fn(() => Promise.resolve({ installing: null })) };
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    const { register } = loadFresh();
    register();

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('load', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  test('does nothing when the browser does not support service workers', () => {
    delete navigator.serviceWorker;
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    const { register } = loadFresh();
    register();

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('load', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  test('does nothing when PUBLIC_URL is on a different origin than the page', () => {
    process.env.PUBLIC_URL = 'https://cdn.example.com';
    navigator.serviceWorker = { register: jest.fn(() => Promise.resolve({ installing: null })) };
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    const { register } = loadFresh();
    register();

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('load', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  test('logs the offline/PWA message once the service worker is ready on localhost', async () => {
    setHostname('localhost');
    navigator.serviceWorker = { ready: Promise.resolve({}) };
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, headers: { get: () => 'text/javascript' } }));

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('being served cache-first'));
  });
});

describe('checkValidServiceWorker (only reachable on localhost)', () => {
  test('reloads the page when the service worker script responds 404', async () => {
    const unregister = jest.fn(() => Promise.resolve());
    navigator.serviceWorker = { ready: Promise.resolve({ unregister }) };
    global.fetch = jest.fn(() => Promise.resolve({ status: 404, headers: { get: () => null } }));
    setHostname('localhost');

    const { register } = loadFresh();
    triggerLoad(register);
    await flush(5);

    expect(unregister).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });

  test('reloads the page when the response is not javascript', async () => {
    const unregister = jest.fn(() => Promise.resolve());
    navigator.serviceWorker = { ready: Promise.resolve({ unregister }) };
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, headers: { get: () => 'text/html' } }));
    setHostname('localhost');

    const { register } = loadFresh();
    triggerLoad(register);
    await flush(5);

    expect(window.location.reload).toHaveBeenCalled();
  });

  test('proceeds normally when the content-type is missing but the status is not 404', async () => {
    navigator.serviceWorker = {
      ready: Promise.resolve({}),
      register: jest.fn(() => Promise.resolve({ installing: null })),
    };
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, headers: { get: () => null } }));
    setHostname('localhost');

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(navigator.serviceWorker.register).toHaveBeenCalled();
  });

  test('registers the service worker when a valid javascript file is found', async () => {
    navigator.serviceWorker = {
      ready: Promise.resolve({}),
      register: jest.fn(() => Promise.resolve({ installing: null })),
    };
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, headers: { get: () => 'application/javascript' } }));
    setHostname('localhost');

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(navigator.serviceWorker.register).toHaveBeenCalled();
  });

  test('logs an offline message when the fetch itself fails', async () => {
    navigator.serviceWorker = { ready: Promise.resolve({}) };
    global.fetch = jest.fn(() => Promise.reject(new Error('network down')));
    setHostname('localhost');

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No internet connection'));
  });
});

describe('registerValidSW (reachable directly off localhost, or via checkValidServiceWorker)', () => {
  function registerAndGetRegistration(config) {
    const installingWorker = { onstatechange: null, state: 'installing' };
    const registration = { onupdatefound: null, installing: installingWorker };
    navigator.serviceWorker = { register: jest.fn(() => Promise.resolve(registration)) };

    const { register } = loadFresh();
    let loadCallback;
    const spy = jest.spyOn(window, 'addEventListener').mockImplementation((event, cb) => {
      if (event === 'load') loadCallback = cb;
    });
    register(config);
    spy.mockRestore();

    return { registration, installingWorker, triggerLoad: () => loadCallback() };
  }

  test('calls config.onSuccess and logs when installed with no prior controller', async () => {
    const onSuccess = jest.fn();
    const { registration, installingWorker, triggerLoad: fireLoad } = registerAndGetRegistration({ onSuccess });
    fireLoad();
    await flush();

    registration.onupdatefound();
    installingWorker.state = 'installed';
    installingWorker.onstatechange();

    expect(console.log).toHaveBeenCalledWith('Content is cached for offline use.');
    expect(onSuccess).toHaveBeenCalledWith(registration);
  });

  test('calls config.onUpdate and logs when installed with an existing controller', async () => {
    const onUpdate = jest.fn();
    const { registration, installingWorker, triggerLoad: fireLoad } = registerAndGetRegistration({ onUpdate });
    navigator.serviceWorker.controller = {};
    fireLoad();
    await flush();

    registration.onupdatefound();
    installingWorker.state = 'installed';
    installingWorker.onstatechange();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('New content is available'));
    expect(onUpdate).toHaveBeenCalledWith(registration);
  });

  test('does not throw and calls neither callback when config has neither onSuccess nor onUpdate', async () => {
    const { registration, installingWorker, triggerLoad: fireLoad } = registerAndGetRegistration({});
    fireLoad();
    await flush();

    expect(() => {
      registration.onupdatefound();
      installingWorker.state = 'installed';
      installingWorker.onstatechange();
    }).not.toThrow();
  });

  test('does not throw when there is an existing controller but config has no onUpdate', async () => {
    const { registration, installingWorker, triggerLoad: fireLoad } = registerAndGetRegistration({});
    navigator.serviceWorker.controller = {};
    fireLoad();
    await flush();

    expect(() => {
      registration.onupdatefound();
      installingWorker.state = 'installed';
      installingWorker.onstatechange();
    }).not.toThrow();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('New content is available'));
  });

  test('does nothing when installingWorker is null', async () => {
    navigator.serviceWorker = { register: jest.fn(() => Promise.resolve({ onupdatefound: null, installing: null })) };
    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    const registration = await navigator.serviceWorker.register.mock.results[0].value;
    expect(() => registration.onupdatefound()).not.toThrow();
  });

  test('does nothing while the installing worker has not reached the "installed" state', async () => {
    const { registration, installingWorker, triggerLoad: fireLoad } = registerAndGetRegistration({});
    fireLoad();
    await flush();

    registration.onupdatefound();
    installingWorker.state = 'installing';
    expect(() => installingWorker.onstatechange()).not.toThrow();
    expect(console.log).not.toHaveBeenCalledWith('Content is cached for offline use.');
  });

  test('logs the error when registration itself fails', async () => {
    navigator.serviceWorker = { register: jest.fn(() => Promise.reject(new Error('registration failed'))) };

    const { register } = loadFresh();
    triggerLoad(register);
    await flush();

    expect(console.error).toHaveBeenCalledWith('Error during service worker registration:', expect.any(Error));
  });
});

describe('unregister', () => {
  test('unregisters the service worker when supported', async () => {
    const unregister = jest.fn();
    navigator.serviceWorker = { ready: Promise.resolve({ unregister }) };

    const serviceWorker = loadFresh();
    serviceWorker.unregister();
    await flush();

    expect(unregister).toHaveBeenCalled();
  });

  test('does nothing when service workers are not supported', () => {
    delete navigator.serviceWorker;
    const serviceWorker = loadFresh();

    expect(() => serviceWorker.unregister()).not.toThrow();
  });

  test('logs the error message if unregistering fails', async () => {
    navigator.serviceWorker = { ready: Promise.reject(new Error('could not unregister')) };

    const serviceWorker = loadFresh();
    serviceWorker.unregister();
    await flush();

    expect(console.error).toHaveBeenCalledWith('could not unregister');
  });
});
