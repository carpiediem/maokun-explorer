import CATEGORIES from './categories.json';
const VOYAGES = ['none', 1, 2, 3, 4, 5, 6, 7];

const allTrue = (agg, cur) => Object.assign(agg, { [cur]: true });
const allFalse = (agg, cur) => Object.assign(agg, { [cur]: false });
const ALL_CATEGORIES = CATEGORIES.reduce(allTrue, {});
const NO_CATEGORIES = CATEGORIES.reduce(allFalse, {});
const ALL_VOYAGES = VOYAGES.reduce(allTrue, {});
const NO_VOYAGES = VOYAGES.reduce(allFalse, {});

export default (onChange, categories, voyages) => (group, key, value) => {
  let setting;
  switch (group) {
    case 'categories':
      if (key === null) {
        setting = value ? ALL_CATEGORIES : NO_CATEGORIES;
      } else {
        setting = Object.assign({}, categories, { [key]: value });
      }
      break;

    case 'voyages':
      if (key === null) {
        setting = value ? ALL_VOYAGES : NO_VOYAGES;
      } else {
        setting = Object.assign({}, voyages, { [key]: value });
      }
      break;

    default:
      return;
  }

  onChange(group, setting);
};
