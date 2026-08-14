import React from 'react';
import { render, screen } from '@testing-library/react';

import { intlEnWrapper, intlZhWrapper } from '../../LocaleContext';
import ModernNames from './ModernNames';

const PROPS = {
  nameEn: 'Kozhikode',
  nameTc: '古里',
  othersEn: 'Calicut',
  othersTc: '卡利卡特',
  region: 'India',
};

describe('when locale is en', () => {
  test('renders the English name and alternate names', () => {
    render(<ModernNames {...PROPS} />, intlEnWrapper);

    expect(screen.getByText('Kozhikode')).toBeInTheDocument();
    expect(screen.getByText('Calicut')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
  });
});

describe('when locale is zh', () => {
  test('renders the Traditional Chinese name and alternate names', () => {
    render(<ModernNames {...PROPS} />, intlZhWrapper);

    expect(screen.getByText('古里')).toBeInTheDocument();
    expect(screen.getByText('卡利卡特')).toBeInTheDocument();
  });
});

describe('when region is not provided', () => {
  test('renders no region text', () => {
    render(<ModernNames {...PROPS} region={undefined} />, intlEnWrapper);
    expect(screen.queryByText('India')).toBeNull();
  });
});
