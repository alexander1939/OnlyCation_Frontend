import React, { createContext, useContext, type ReactNode } from 'react';
import { useRegisterAuthHook } from '../../hooks/regAuth/index.ts';
import type { AuthContextType } from './reg.types.ts';

const RegisterAuthContext = createContext<AuthContextType | undefined>(undefined);

interface RegisterAuthProviderProps {
  children: ReactNode;
}

export const RegisterAuthProvider: React.FC<RegisterAuthProviderProps> = ({ children }) => {
  const auth = useRegisterAuthHook();

  return (
    <RegisterAuthContext.Provider value={auth}>
      {children}
    </RegisterAuthContext.Provider>
  );
};

export const useRegisterAuthContext = (): AuthContextType => {
  const context = useContext(RegisterAuthContext);
  if (context === undefined) {
    throw new Error('useRegisterAuthContext must be used within a RegisterAuthProvider');
  }
  return context;
};
