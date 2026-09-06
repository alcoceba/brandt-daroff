import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from './Timer';

describe('Timer component', () => {
  it('should render correct progress circle stroke parameters', () => {
    // Circumference is 2 * PI * RADIUS = 2 * PI * 140 = 879.646
    const { container } = render(
      <Timer secondsRemaining={15} totalDuration={30} isRunning={true} kind="sitting" />
    );
    
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle).toBeInTheDocument();
    
    // Halfway complete, offset should be half of circumference
    const strokeDashoffset = parseFloat(progressCircle.getAttribute('stroke-dashoffset')!);
    expect(strokeDashoffset).toBeCloseTo(439.823, 1);
  });

  it('should render remaining seconds when running', () => {
    render(<Timer secondsRemaining={45.5} totalDuration={60} isRunning={true} kind="sitting" />);
    // Math.ceil of 45.5 is 46
    expect(screen.getByText('46')).toBeInTheDocument();
  });

  it('should format minutes and seconds correctly when running', () => {
    render(<Timer secondsRemaining={75} totalDuration={120} isRunning={true} kind="sitting" />);
    expect(screen.getByText('1:15')).toBeInTheDocument();
  });

  it('should render Pause icon when not running', () => {
    const { container } = render(
      <Timer secondsRemaining={15} totalDuration={30} isRunning={false} kind="sitting" />
    );
    
    // Pause icon (svg inside span) should render instead of text
    expect(screen.queryByText('15')).toBeNull();
    const pauseSvg = container.querySelector('svg.lucide-pause');
    expect(pauseSvg).toBeInTheDocument();
  });
});
