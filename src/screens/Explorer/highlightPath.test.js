import highlightPath from './highlightPath';

afterEach(() => {
  document.body.innerHTML = '';
});

const PATHS = [{ properties: { code: 'wei-1', landmarks: [1, 2, 3] } }];

test('adds the selected class to every path segment with a matching code', () => {
  document.body.innerHTML = `
    <path class="code-wei-1"></path>
    <path class="code-wei-1"></path>
    <path class="code-other"></path>
  `;

  highlightPath('wei-1', PATHS, []);

  const [first, second, other] = document.querySelectorAll('path');
  expect(first.classList.contains('selected')).toBe(true);
  expect(second.classList.contains('selected')).toBe(true);
  expect(other.classList.contains('selected')).toBe(false);
});

test('marks landmarks present on both maps, expanding the modern marker', () => {
  document.body.innerHTML = `
    <section class="maokun"><path class="circle-marker id-1" d="a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 "></path></section>
    <section class="modern"><path class="circle-marker id-1" d="M0,0a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 "></path></section>
  `;

  highlightPath('wei-1', PATHS, []);

  const maokunLandmark = document.querySelector('section.maokun path.id-1');
  const modernLandmark = document.querySelector('section.modern path.id-1');

  expect(maokunLandmark.classList.contains('path-landmark')).toBe(true);
  expect(modernLandmark.classList.contains('path-landmark')).toBe(true);
  expect(modernLandmark.getAttribute('d')).toBe('M0,0m-5,0a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 ');
});

describe('when a landmark is missing from one or both maps', () => {
  test('does not throw, and skips the missing marker', () => {
    document.body.innerHTML = `<section class="maokun"><path class="circle-marker id-2"></path></section>`;

    expect(() => highlightPath('wei-1', PATHS, [])).not.toThrow();

    expect(document.querySelector('section.maokun path.id-2').classList.contains('path-landmark')).toBe(true);
  });
});
