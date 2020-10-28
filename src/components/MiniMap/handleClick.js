const MARGINS = { top: 10, left: 50, right: 50 };
const SIZE = {
  width: window.innerWidth - MARGINS.left - MARGINS.right,
  height: 55,
};

export default (onClick) => (evt) => {
  const percentCoords = {
    xRatio: (evt.nativeEvent.pageX - MARGINS.left) / SIZE.width,
    yRatio: (evt.nativeEvent.pageY - MARGINS.top) / SIZE.height,
  };

  onClick(percentCoords);
};
