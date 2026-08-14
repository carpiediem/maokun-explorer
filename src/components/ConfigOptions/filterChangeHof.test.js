import filterChangeHof from './filterChangeHof';
import CATEGORIES from './categories.json';

const VOYAGES = ['none', 1, 2, 3, 4, 5, 6, 7];

describe('categories group', () => {
  test('key === null and value true sets every category to true', () => {
    const onChange = jest.fn();
    const handleChange = filterChangeHof(onChange, {}, {});

    handleChange('categories', null, true);

    const expected = CATEGORIES.reduce((agg, cur) => Object.assign(agg, { [cur]: true }), {});
    expect(onChange).toHaveBeenCalledWith('categories', expected);
  });

  test('key === null and value false sets every category to false', () => {
    const onChange = jest.fn();
    const handleChange = filterChangeHof(onChange, {}, {});

    handleChange('categories', null, false);

    const expected = CATEGORIES.reduce((agg, cur) => Object.assign(agg, { [cur]: false }), {});
    expect(onChange).toHaveBeenCalledWith('categories', expected);
  });

  test('key set updates only that category, preserving others', () => {
    const onChange = jest.fn();
    const categories = { town: true, area: false };
    const handleChange = filterChangeHof(onChange, categories, {});

    handleChange('categories', 'area', true);

    expect(onChange).toHaveBeenCalledWith('categories', { town: true, area: true });
  });
});

describe('voyages group', () => {
  test('key === null and value true sets every voyage to true', () => {
    const onChange = jest.fn();
    const handleChange = filterChangeHof(onChange, {}, {});

    handleChange('voyages', null, true);

    const expected = VOYAGES.reduce((agg, cur) => Object.assign(agg, { [cur]: true }), {});
    expect(onChange).toHaveBeenCalledWith('voyages', expected);
  });

  test('key === null and value false sets every voyage to false', () => {
    const onChange = jest.fn();
    const handleChange = filterChangeHof(onChange, {}, {});

    handleChange('voyages', null, false);

    const expected = VOYAGES.reduce((agg, cur) => Object.assign(agg, { [cur]: false }), {});
    expect(onChange).toHaveBeenCalledWith('voyages', expected);
  });

  test('key set updates only that voyage, preserving others', () => {
    const onChange = jest.fn();
    const voyages = { 1: true, 2: false };
    const handleChange = filterChangeHof(onChange, {}, voyages);

    handleChange('voyages', 2, true);

    expect(onChange).toHaveBeenCalledWith('voyages', { 1: true, 2: true });
  });
});

describe('unrecognized group', () => {
  test('does not call onChange', () => {
    const onChange = jest.fn();
    const handleChange = filterChangeHof(onChange, {}, {});

    handleChange('unknown', 'key', true);

    expect(onChange).not.toHaveBeenCalled();
  });
});
