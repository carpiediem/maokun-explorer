export default (categories, voyages) =>
  ({ properties }) =>
    categories[properties.category] &&
    (properties.voyages.length === 0
      ? voyages.none
      : properties.voyages.reduce((agg, cur) => agg || voyages[cur], false));
