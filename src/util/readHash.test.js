import readHash from './readHash';
import centerMaoKun from '../components/MaoKunMap/centerOn';
import centerModern from '../components/ModernMap/centerOn';

jest.mock('../components/MaoKunMap/centerOn', () => jest.fn());
jest.mock('../components/ModernMap/centerOn', () => jest.fn());

const PLACE = {
  properties: { id: 5 },
  geometry: { zoomify: [100, 200], coordinates: [10, 20] },
};

const PATH = {
  properties: { code: 'wei-1' },
  geometry: { zoomify: [300, 400], coordinates: [[30, 40]] },
};

const maokunMapRef = {};
const modernMapRef = {};

afterEach(() => {
  window.location.hash = '';
});

describe('when the hash selects a place', () => {
  test('returns the point selection and centers both maps on it', () => {
    window.location.hash = '#/place/5';

    const toSelect = readHash([PLACE], [PATH], maokunMapRef, modernMapRef);

    expect(toSelect).toEqual({ point: 5 });
    expect(centerMaoKun).toHaveBeenCalledWith(maokunMapRef, PLACE.geometry.zoomify);
    expect(centerModern).toHaveBeenCalledWith(modernMapRef, PLACE.geometry.coordinates);
  });

  test('does not center the maps when the place id is not found', () => {
    window.location.hash = '#/place/999';

    const toSelect = readHash([PLACE], [PATH], maokunMapRef, modernMapRef);

    expect(toSelect).toEqual({ point: 999 });
    expect(centerMaoKun).not.toHaveBeenCalled();
    expect(centerModern).not.toHaveBeenCalled();
  });
});

describe('when the hash selects a path', () => {
  test('returns the path selection and centers both maps on it', () => {
    window.location.hash = '#/path/wei-1';

    const toSelect = readHash([PLACE], [PATH], maokunMapRef, modernMapRef);

    expect(toSelect).toEqual({ path: 'wei-1' });
    expect(centerMaoKun).toHaveBeenCalledWith(maokunMapRef, PATH.geometry.zoomify);
    expect(centerModern).toHaveBeenCalledWith(modernMapRef, PATH.geometry.coordinates);
  });
});

describe('when the hash does not select anything', () => {
  test('returns an empty selection without centering either map', () => {
    window.location.hash = '';

    const toSelect = readHash([PLACE], [PATH], maokunMapRef, modernMapRef);

    expect(toSelect).toEqual({});
    expect(centerMaoKun).not.toHaveBeenCalled();
    expect(centerModern).not.toHaveBeenCalled();
  });
});
