import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CircularProgress } from './CircularProgress';

const RADIUS = (72 - 6) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

describe('CircularProgress component', () => {
  it('renders an SVG with two circles', () => {
    const { container } = render(<CircularProgress value={0} />);
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('sets full stroke-dashoffset when value is 0', () => {
    const { container } = render(<CircularProgress value={0} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(parseFloat(progressCircle.getAttribute('stroke-dashoffset')!)).toBeCloseTo(CIRCUMFERENCE, 1);
  });

  it('sets half stroke-dashoffset when value is 0.5', () => {
    const { container } = render(<CircularProgress value={0.5} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(parseFloat(progressCircle.getAttribute('stroke-dashoffset')!)).toBeCloseTo(CIRCUMFERENCE / 2, 1);
  });

  it('sets zero stroke-dashoffset when value is 1', () => {
    const { container } = render(<CircularProgress value={1} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(parseFloat(progressCircle.getAttribute('stroke-dashoffset')!)).toBeCloseTo(0, 1);
  });

  it('clamps value above 1 to 1', () => {
    const { container } = render(<CircularProgress value={1.5} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(parseFloat(progressCircle.getAttribute('stroke-dashoffset')!)).toBeCloseTo(0, 1);
  });

  it('clamps value below 0 to 0', () => {
    const { container } = render(<CircularProgress value={-0.5} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(parseFloat(progressCircle.getAttribute('stroke-dashoffset')!)).toBeCloseTo(CIRCUMFERENCE, 1);
  });

  it('renders children in the center', () => {
    const { getByText } = render(
      <CircularProgress value={0.5}>
        <span>50%</span>
      </CircularProgress>,
    );
    expect(getByText('50%')).toBeInTheDocument();
  });
});
