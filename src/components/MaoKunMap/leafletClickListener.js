export default (onSelect, onClick) =>
  ({ originalEvent, latlng, ...rest }) => {


    // console.log({ originalEvent, latlng, ...rest }, latlngToXy(latlng));

    if (onClick) onClick(latlng);

    if (!onSelect) {
      console.warn('onSelect is undefined, when passed to leafletClickListener');
      return;
    }
    if (/leaflet-container/.test(originalEvent.path[0].className)) onSelect(null);
  };
