export default function highlightPath(code, paths, places) {
  const { landmarks } = paths.find((p) => p.properties.code === code).properties;

  Array.from(document.querySelectorAll(`path.code-${code}`)).forEach((p) => p.classList.add('selected'));

  landmarks.forEach((id) => {
    const maokunLandmark = document.querySelector(`section.maokun path.circle-marker.id-${id}`);
    const modernLandmark = document.querySelector(`section.modern path.circle-marker.id-${id}`);

    if (maokunLandmark) maokunLandmark.classList.add('path-landmark');
    if (!modernLandmark) return;

    modernLandmark.setAttribute(
      'd',
      modernLandmark
        .getAttribute('d')
        .replace('a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 ', 'm-5,0a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 '),
    );
    modernLandmark.classList.add('path-landmark');
  });
}
