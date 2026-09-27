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

  it('renders three circles when secondaryValue is provided', () => {
    const { container } = render(<CircularProgress value={0.3} secondaryValue={0.2} />);
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(3);
    // Track circle is circles[0]
    // Secondary circle (amber) is circles[1]
    expect(circles[1]).toHaveClass('stroke-amber-400');
    // Primary circle (green) is circles[2]
    expect(circles[2]).toHaveClass('stroke-brand-500');
    // Secondary circle covers total value (0.3 + 0.2 = 0.5)
    expect(parseFloat(circles[1].getAttribute('stroke-dashoffset')!)).toBeCloseTo(CIRCUMFERENCE * 0.5, 1);
    // Primary circle covers primary value (0.3)
    expect(parseFloat(circles[2].getAttribute('stroke-dashoffset')!)).toBeCloseTo(CIRCUMFERENCE * 0.7, 1);
  });
});
