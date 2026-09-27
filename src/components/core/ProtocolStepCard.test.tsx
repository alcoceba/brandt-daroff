import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtocolStepCard } from './ProtocolStepCard';

describe('ProtocolStepCard component', () => {
  it('renders step number, title, duration and description', () => {
    render(
      <ProtocolStepCard
        number={1}
        title="Assegut al llit"
        duration="30s"
        text="Seu al caire del llit en posició vertical."
        note="Mantingues l'esquena recta"
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Assegut al llit')).toBeInTheDocument();
    expect(screen.getByText('30s')).toBeInTheDocument();
    expect(
      screen.getByText('Seu al caire del llit en posició vertical.'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Mantingues l'esquena recta/)).toBeInTheDocument();
  });
});
