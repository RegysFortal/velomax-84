
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Client } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type ClientsContextType = {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  loading: boolean;
};

// Initial clients data for demo purposes
const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Supermercado Nordeste LTDA',
    tradingName: 'Supermercado Nordeste',
    street: 'Av. Dom Luis',
    number: '500',
    complement: 'Sala 302',
    neighborhood: 'Aldeota',
    city: 'Fortaleza',
    state: 'CE',
    zipCode: '60160230',
    contact: 'Maria Silva',
    phone: '(85) 3322-1122',
    email: 'contato@supnordeste.com.br',
    priceTableId: 'table-a',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-2',
    name: 'Farmácia Popular Comércio de Medicamentos LTDA',
    tradingName: 'Farmácia Popular',
    street: 'Rua Padre Valdevino',
    number: '100',
    complement: '',
    neighborhood: 'Joaquim Távora',
    city: 'Fortaleza',
    state: 'CE',
    zipCode: '60135040',
    contact: 'Carlos Mendes',
    phone: '(85) 3433-5566',
    email: 'atendimento@farmaciapopular.com.br',
    priceTableId: 'table-b',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-3',
    name: 'Hospital São Camilo S.A.',
    tradingName: 'Hospital São Camilo',
    street: 'Av. Barão de Studart',
    number: '2000',
    complement: 'Bloco A',
    neighborhood: 'Aldeota',
    city: 'Fortaleza',
    state: 'CE',
    zipCode: '60120000',
    contact: 'Ana Beatriz',
    phone: '(85) 3288-9900',
    email: 'logistica@hospitalsaocamilo.com',
    priceTableId: 'table-c',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-4',
    name: 'Distribuidora Central Comércio e Serviços LTDA',
    tradingName: 'Distribuidora Central',
    street: 'Rodovia BR-116',
    number: 'Km 10',
    complement: 'Galpão 5',
    neighborhood: 'Centro',
    city: 'Eusébio',
    state: 'CE',
    zipCode: '61760000',
    contact: 'Paulo Roberto',
    phone: '(85) 3344-7788',
    email: 'paulo@distcentral.com.br',
    priceTableId: 'table-d',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load clients from localStorage or use initial data
    const loadClients = () => {
      const storedClients = localStorage.getItem('velomax_clients');
      if (storedClients) {
        try {
          setClients(JSON.parse(storedClients));
        } catch (error) {
          console.error('Failed to parse stored clients', error);
          setClients(INITIAL_CLIENTS);
        }
      } else {
        setClients(INITIAL_CLIENTS);
      }
      setLoading(false);
    };
    
    loadClients();
  }, []);
  
  // Save clients to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_clients', JSON.stringify(clients));
    }
  }, [clients, loading]);
  
  const addClient = (
    client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const timestamp = new Date().toISOString();
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setClients((prev) => [...prev, newClient]);
    toast({
      title: "Cliente adicionado",
      description: `O cliente "${client.name}" foi adicionado com sucesso.`,
    });
  };
  
  const updateClient = (id: string, client: Partial<Client>) => {
    setClients((prev) => 
      prev.map((c) => 
        c.id === id 
          ? { ...c, ...client, updatedAt: new Date().toISOString() } 
          : c
      )
    );
    toast({
      title: "Cliente atualizado",
      description: `O cliente foi atualizado com sucesso.`,
    });
  };
  
  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
    toast({
      title: "Cliente removido",
      description: `O cliente foi removido com sucesso.`,
    });
  };
  
  const getClient = (id: string) => {
    return clients.find((client) => client.id === id);
  };
  
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
