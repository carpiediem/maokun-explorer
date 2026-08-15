import handleClick from './handleClick';

test('converts a click event into percentage-based coordinates', () => {
  const onClick = jest.fn();
  const width = window.innerWidth - 100;

  handleClick(onClick)({ nativeEvent: { pageX: 50 + width / 2, pageY: 10 + 27.5 } });

  expect(onClick).toHaveBeenCalledWith({ xRatio: 0.5, yRatio: 0.5 });
});
