import highlightPlace from './highlightPlace';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('when both markers exist', () => {
  test('adds the selected class when not a landmark', () => {
    document.body.innerHTML = `
      <section class="maokun"><path class="circle-marker id-42"></path></section>
      <section class="modern"><path class="circle-marker id-42"></path></section>
    `;

    highlightPlace(42);

    document.querySelectorAll('path.circle-marker').forEach((marker) => {
      expect(marker.classList.contains('selected')).toBe(true);
      expect(marker.classList.contains('path-landmark')).toBe(false);
    });
  });

  test('adds the path-landmark class when called with a numeric index', () => {
    document.body.innerHTML = `
      <section class="maokun"><path class="circle-marker id-42"></path></section>
      <section class="modern"><path class="circle-marker id-42"></path></section>
    `;

    highlightPlace(42, 0);

    document.querySelectorAll('path.circle-marker').forEach((marker) => {
      expect(marker.classList.contains('path-landmark')).toBe(true);
      expect(marker.classList.contains('selected')).toBe(false);
    });
  });
});

describe('when neither marker exists', () => {
  test('does not throw', () => {
    expect(() => highlightPlace(999)).not.toThrow();
  });
});
