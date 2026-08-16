import handleMaokunViewChange from './handleMaokunViewChange';
import MAOKUN_SIZE from '../../components/MaoKunMap/size.json';

const PERCENT_BOUNDS = { _southWest: [0.2, 0.8], _northEast: [0.8, 0.2] };
const X_MID = 0.5 * MAOKUN_SIZE.zoomify[0];
const Y_MID = 0.5 * MAOKUN_SIZE.zoomify[1];

function fovRect() {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  return { current: rect };
}

function place(id, { inView }) {
  return {
    properties: { id },
    geometry: {
      type: 'Point',
      coordinates: [1, 2],
      zoomify: inView ? [X_MID, Y_MID] : [0, 0],
    },
  };
}

test('updates the MiniMap field-of-view rect from the percent bounds', () => {
  const minimapFovRef = fovRect();
  const modernMapRef = { current: { leafletElement: { fitBounds: jest.fn() } } };

  handleMaokunViewChange(modernMapRef, minimapFovRef, [], { current: {} })(PERCENT_BOUNDS);

  expect(minimapFovRef.current.getAttribute('x')).toBe('20%');
});

describe('when nothing was recently selected', () => {
  test('fits the ModernMap to the bounds of places visible on the Mao Kun map', () => {
    const minimapFovRef = fovRect();
    const modernMapRef = { current: { leafletElement: { fitBounds: jest.fn() } } };
    const places = [place(1, { inView: true }), place(2, { inView: false })];

    handleMaokunViewChange(modernMapRef, minimapFovRef, places, { current: {} })(PERCENT_BOUNDS);

    expect(modernMapRef.current.leafletElement.fitBounds).toHaveBeenCalledWith([
      [2 - 0.08, 1 - 0.08],
      [2 + 0.08, 1 + 0.08],
    ]);
  });
});

describe('when a place was selected more than 2 seconds ago', () => {
  test('still fits the ModernMap to the bounds', () => {
    const minimapFovRef = fovRect();
    const modernMapRef = { current: { leafletElement: { fitBounds: jest.fn() } } };
    const selectedRef = { current: { time: Date.now() - 3000 } };

    handleMaokunViewChange(modernMapRef, minimapFovRef, [], selectedRef)(PERCENT_BOUNDS);

    expect(modernMapRef.current.leafletElement.fitBounds).toHaveBeenCalled();
  });
});

describe('when a place was selected within the last 2 seconds', () => {
  test('does not move the ModernMap (the view change was caused by centerOn)', () => {
    const minimapFovRef = fovRect();
    const modernMapRef = { current: { leafletElement: { fitBounds: jest.fn() } } };
    const selectedRef = { current: { time: Date.now() } };

    handleMaokunViewChange(modernMapRef, minimapFovRef, [], selectedRef)(PERCENT_BOUNDS);

    expect(modernMapRef.current.leafletElement.fitBounds).not.toHaveBeenCalled();
  });
});

describe('when the selection ref is updated after the handler closure was created (stale-closure regression)', () => {
  test('reads the current value from the ref rather than a value frozen at creation time', () => {
    const minimapFovRef = fovRect();
    const modernMapRef = { current: { leafletElement: { fitBounds: jest.fn() } } };
    const selectedRef = { current: {} };

    // Simulate a memoized component holding onto a handler created before the selection ref
    // was updated (see MaoKunMap's `sameDataLength` memo comparator).
    const handler = handleMaokunViewChange(modernMapRef, minimapFovRef, [], selectedRef);
    selectedRef.current = { time: Date.now() };
    handler(PERCENT_BOUNDS);

    expect(modernMapRef.current.leafletElement.fitBounds).not.toHaveBeenCalled();
  });
});
