import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/OnboardingSteps.css';

interface StepDef {
  index: number;
  label: string;
  path: string;
}

const steps: StepDef[] = [
  { index: 1, label: 'Preferencias', path: '/profile/preferences' },
  { index: 2, label: 'Documentos', path: '/documents/create' },
  { index: 3, label: 'Precios', path: '/prices/create' },
  { index: 4, label: 'Video', path: '/profile/video' },
  { index: 5, label: 'Agenda', path: '/profile/agenda' },
  { index: 6, label: 'Cartera', path: '/profile/cartera' },
];

export const OnboardingSteps: React.FC = () => {
  const location = useLocation();

  const current = useMemo(() => {
    const idx = steps.findIndex(s => location.pathname.startsWith(s.path));
    return idx >= 0 ? steps[idx].index : 1;
  }, [location.pathname]);

  const iconFor = (step: StepDef) => {
    switch (step.label) {
      case 'Preferencias':
        return '⚙️';
      case 'Documentos':
        return '📄';
      case 'Precios':
        return '💲';
      case 'Video':
        return '🎥';
      case 'Agenda':
        return '📅';
      case 'Cartera':
        return '💼';
      default:
        return '•';
    }
  };

  return (
    <nav className="obs-steps" aria-label="Onboarding steps">
      <ol className="obs-list">
        {steps.map(step => {
          const isActive = step.index === current;
          const isDone = step.index < current;
          const isDisabled = step.index > current;
          const content = (
            <>
              <span className="obs-circle" aria-hidden title={step.label}>
                {iconFor(step)}
              </span>
              <span className="obs-label">{step.label}</span>
            </>
          );
          return (
            <li key={step.index} className="obs-item">
              {isDisabled ? (
                <span className={`obs-link is-disabled ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`} aria-disabled>
                  {content}
                </span>
              ) : (
                <Link to={step.path} className={`obs-link ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}>
                  {content}
                </Link>
              )}
              {step.index < steps.length && <span className={`obs-sep ${isDone ? 'is-done' : ''}`} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default OnboardingSteps;
