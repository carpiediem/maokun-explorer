export default (prevProps, nextProps) =>
  prevProps.places.length === nextProps.places.length && prevProps.paths.length === nextProps.paths.length;
