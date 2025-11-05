import { useContext } from 'react';
import { ActivationContext, type ActivationContextType } from './context';

export const useActivation = (): ActivationContextType => {
  const ctx = useContext(ActivationContext);
  if (!ctx) throw new Error('useActivation must be used within an ActivationProvider');
  return ctx;
};
