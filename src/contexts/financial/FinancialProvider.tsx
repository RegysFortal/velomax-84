
import React from 'react';
import { FinancialProvider as Provider } from './FinancialContext';

interface FinancialProviderWrapperProps {
  children: React.ReactNode;
}

export function FinancialProviderWrapper({ children }: FinancialProviderWrapperProps) {
  return (
    <Provider>
      {children}
    </Provider>
  );
}
