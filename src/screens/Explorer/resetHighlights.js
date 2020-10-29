export default () => {
  Array.from(
    document.querySelectorAll('path.circle-marker, path.path')
  ).forEach((f) => {
    f.classList.remove('selected');
    f.classList.remove('path-landmark');
  });
  
  // Array.from(
  //   document.querySelectorAll('.modern path.circle-marker, path.path')
  // ).forEach((f) =>
  //   f.setAttribute(
  //     'd',
  //     f
  //       .getAttribute('d')
  //       .replace(
  //         /m-\d+,0a\d+,\d+ 0 1,0 \d+,0 a\d+,\d+ 0 1,0 -\d+,0 /,
  //         'a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 '
  //       )
  //   )
  // );
};
