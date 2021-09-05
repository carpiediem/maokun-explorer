export default (agg, cur) => {
  return [
    [Math.min(agg[0][0], cur.geometry.coordinates[1]), Math.min(agg[0][1], cur.geometry.coordinates[0])],
    [Math.max(agg[1][0], cur.geometry.coordinates[1]), Math.max(agg[1][1], cur.geometry.coordinates[0])],
  ];
};
