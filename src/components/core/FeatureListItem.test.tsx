import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureListItem } from './FeatureListItem';

describe('FeatureListItem component', () => {
  it('renders children with checkmark icon', () => {
    render(<FeatureListItem>Works 100% offline</FeatureListItem>);
    expect(screen.getByText('Works 100% offline')).toBeInTheDocument();
  });
});
