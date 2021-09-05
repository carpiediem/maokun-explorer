export default function resetHighlights() {
  Array.from(document.querySelectorAll('path.circle-marker, path.path')).forEach((f) => {
    f.classList.remove('selected');
    f.classList.remove('path-landmark');
  });
}
