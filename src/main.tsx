
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CitiesProvider } from './contexts/CitiesContext';
import { ClientsProvider } from './contexts/ClientsContext';
import { DeliveriesProvider } from './contexts/DeliveriesContext';
import { LogbookProvider } from './contexts/LogbookContext';
import { ShipmentsProvider } from './contexts/ShipmentsContext';
import { PriceTablesProvider } from './contexts/PriceTablesContext';
import { FinancialProvider } from './contexts/FinancialContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <CitiesProvider>
              <ClientsProvider>
                <DeliveriesProvider>
                  <LogbookProvider>
                    <ShipmentsProvider>
                      <PriceTablesProvider>
                        <FinancialProvider>
                          <App />
                          <Toaster />
                        </FinancialProvider>
                      </PriceTablesProvider>
                    </ShipmentsProvider>
                  </LogbookProvider>
                </DeliveriesProvider>
              </ClientsProvider>
            </CitiesProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
