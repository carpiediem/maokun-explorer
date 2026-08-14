import React from 'react';
import { render, screen } from '@testing-library/react';

import { intlEnWrapper } from '../../LocaleContext';
import GlossaryItem from './GlossaryItem.jsx';

test('renders pinyin and the definition for the given id', () => {
  render(<GlossaryItem character="所" pinyin="suǒ" definitionId="glossary.所" />, intlEnWrapper);

  expect(screen.getByText('suǒ')).toBeInTheDocument();
  expect(screen.getByText(/perhaps the location of its headquarters/)).toBeInTheDocument();
});

test('falls back to a placeholder when no definition is found for the id', () => {
  render(<GlossaryItem character="?" pinyin="?" definitionId="glossary.does-not-exist" />, intlEnWrapper);

  expect(screen.getByText('[missing definition]')).toBeInTheDocument();
});

describe('when the character is a single character', () => {
  test('renders the character without the "small" avatar class', () => {
    render(<GlossaryItem character="所" pinyin="suǒ" definitionId="glossary.所" />, intlEnWrapper);

    const avatar = screen.getByText('所');
    expect(avatar.className).not.toMatch(/\bsmall\b/);
  });
});

describe('when the character is more than one character', () => {
  test('renders the character with the "small" avatar class', () => {
    render(<GlossaryItem character="北辰" pinyin="Běichén" definitionId="glossary.北辰" />, intlEnWrapper);

    const avatar = screen.getByText('北辰');
    expect(avatar.className).toMatch(/\bsmall\b/);
  });
});
