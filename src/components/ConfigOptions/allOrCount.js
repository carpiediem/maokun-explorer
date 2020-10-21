export default function allOrCount(boolObject = {}) {
  const values = Object.values(boolObject);

  if (values.every((v) => v)) return 'all';
  if (values.every((v) => !v)) return 'no';

  const trueCount = values.reduce((agg, cur) => (cur ? agg + 1 : agg), 0);

  return `${trueCount} of ${values.length}`;
}
