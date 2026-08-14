import resetHighlights from './resetHighlights';

afterEach(() => {
  document.body.innerHTML = '';
});

test('removes the selected and path-landmark classes from every marker/path', () => {
  document.body.innerHTML = `
    <path class="circle-marker selected"></path>
    <path class="circle-marker path-landmark"></path>
    <path class="path selected path-landmark"></path>
    <path class="unrelated selected"></path>
  `;

  resetHighlights();

  const [marker1, marker2, path, unrelated] = document.querySelectorAll('path');
  expect(marker1.classList.contains('selected')).toBe(false);
  expect(marker2.classList.contains('path-landmark')).toBe(false);
  expect(path.classList.contains('selected')).toBe(false);
  expect(path.classList.contains('path-landmark')).toBe(false);
  expect(unrelated.classList.contains('selected')).toBe(true);
});
