export default (onSelect) => ({ originalEvent }) => {
  if (/leaflet-container/.test(originalEvent.path[0].className)) onSelect(null);
};
