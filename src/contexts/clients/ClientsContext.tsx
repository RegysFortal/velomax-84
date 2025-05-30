
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useFetchClients } from './useFetchClients';
import { useClientsOperations } from './useClientsOperations';
import { ClientsContextType } from './types';

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { clients, setClients, loading } = useFetchClients(user);
  const { addClient, updateClient, deleteClient, getClient } = useClientsOperations(clients, setClients, user);
  
  return (
    <ClientsContext.Provider value={{
      clients,
      addClient,
      updateClient,
      deleteClient,
      getClient,
      loading,
    }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};
