export default (onSelect) => ({ originalEvent }) => {
  if (!onSelect) {
    console.warn('onSelect is undefined, when passed to leafletClickListener');
    return;
  }

  if (/leaflet-container/.test(originalEvent.path[0].className)) onSelect(null);
};
