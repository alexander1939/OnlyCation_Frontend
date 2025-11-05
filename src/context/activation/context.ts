import { createContext } from 'react';
import type { ActivationCheckData } from '../../hooks/activation/useActivationApi';

export interface ActivationContextType {
  loading: boolean;
  error: string | null;
  data: ActivationCheckData | null;
  check: (force?: boolean) => Promise<ActivationCheckData>;
  activate: () => Promise<ActivationCheckData>;
  getNextRoute: (fallback?: string) => string;
}

export const ActivationContext = createContext<ActivationContextType | undefined>(undefined);
