
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Client } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth/AuthContext';

type ClientsContextType = {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  loading: boolean;
};

// Initial clients data for demo purposes - will be used only if fetching fails
const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Supermercado Nordeste LTDA',
    tradingName: 'Supermercado Nordeste',
    document: '12.345.678/0001-00',
    address: 'Av. Dom Luis, 500, Sala 302, Aldeota',
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
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-2',
    name: 'Farmácia Popular Comércio de Medicamentos LTDA',
    tradingName: 'Farmácia Popular',
    document: '23.456.789/0001-11',
    address: 'Rua Padre Valdevino, 100, Joaquim Távora',
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
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-3',
    name: 'Hospital São Camilo S.A.',
    tradingName: 'Hospital São Camilo',
    document: '34.567.890/0001-22',
    address: 'Av. Barão de Studart, 2000, Bloco A, Aldeota',
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
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-4',
    name: 'Distribuidora Central Comércio e Serviços LTDA',
    tradingName: 'Distribuidora Central',
    document: '45.678.901/0001-33',
    address: 'Rodovia BR-116, Km 10, Galpão 5, Centro',
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
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        // Map Supabase data to match our Client type
        const mappedClients = data.map((client: any): Client => ({
          id: client.id,
          name: client.name,
          tradingName: client.trading_name || '',
          document: client.document || '',
          address: client.address || '',
          street: client.street || '',
          number: client.number || '',
          complement: client.complement || '',
          neighborhood: client.neighborhood || '',
          city: client.city || '',
          state: client.state || '',
          zipCode: client.zip_code || '',
          contact: client.contact || '',
          phone: client.phone || '',
          email: client.email || '',
          priceTableId: client.price_table_id || '',
          notes: client.notes || '',
          createdAt: client.created_at || new Date().toISOString(),
          updatedAt: client.updated_at || new Date().toISOString(),
        }));
        
        setClients(mappedClients);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Usando dados locais como fallback.",
          variant: "destructive"
        });
        
        // Load from localStorage as fallback
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
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchClients();
    }
  }, [toast, user]);
  
  // Save clients to localStorage as a backup
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_clients', JSON.stringify(clients));
    }
  }, [clients, loading]);
  
  const addClient = async (
    client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const timestamp = new Date().toISOString();

      // Prepare data for Supabase insert
      const supabaseClient = {
        name: client.name,
        trading_name: client.tradingName,
        document: client.document,
        address: client.address,
        street: client.street,
        number: client.number,
        complement: client.complement,
        neighborhood: client.neighborhood,
        city: client.city,
        state: client.state,
        zip_code: client.zipCode,
        contact: client.contact,
        phone: client.phone,
        email: client.email,
        price_table_id: client.priceTableId,
        notes: client.notes,
        user_id: user?.id,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      const { data, error } = await supabase
        .from('clients')
        .insert(supabaseClient)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Map the returned data to our Client type
      const newClient: Client = {
        id: data.id,
        name: data.name,
        tradingName: data.trading_name || '',
        document: data.document || '',
        address: data.address || '',
        street: data.street || '',
        number: data.number || '',
        complement: data.complement || '',
        neighborhood: data.neighborhood || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zip_code || '',
        contact: data.contact || '',
        phone: data.phone || '',
        email: data.email || '',
        priceTableId: data.price_table_id || '',
        notes: data.notes || '',
        createdAt: data.created_at || timestamp,
        updatedAt: data.updated_at || timestamp,
      };
      
      setClients((prev) => [...prev, newClient]);
      
      toast({
        title: "Cliente adicionado",
        description: `O cliente "${client.name}" foi adicionado com sucesso.`,
      });
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Ocorreu um erro ao adicionar o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const updateClient = async (id: string, client: Partial<Client>) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Prepare data for Supabase update
      const supabaseClient: any = {
        updated_at: timestamp
      };
      
      // Map properties from client to supabaseClient
      if (client.name !== undefined) supabaseClient.name = client.name;
      if (client.tradingName !== undefined) supabaseClient.trading_name = client.tradingName;
      if (client.document !== undefined) supabaseClient.document = client.document;
      if (client.address !== undefined) supabaseClient.address = client.address;
      if (client.street !== undefined) supabaseClient.street = client.street;
      if (client.number !== undefined) supabaseClient.number = client.number;
      if (client.complement !== undefined) supabaseClient.complement = client.complement;
      if (client.neighborhood !== undefined) supabaseClient.neighborhood = client.neighborhood;
      if (client.city !== undefined) supabaseClient.city = client.city;
      if (client.state !== undefined) supabaseClient.state = client.state;
      if (client.zipCode !== undefined) supabaseClient.zip_code = client.zipCode;
      if (client.contact !== undefined) supabaseClient.contact = client.contact;
      if (client.phone !== undefined) supabaseClient.phone = client.phone;
      if (client.email !== undefined) supabaseClient.email = client.email;
      if (client.priceTableId !== undefined) supabaseClient.price_table_id = client.priceTableId;
      if (client.notes !== undefined) supabaseClient.notes = client.notes;

      const { error } = await supabase
        .from('clients')
        .update(supabaseClient)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setClients((prev) => 
        prev.map((c) => 
          c.id === id 
            ? { ...c, ...client, updatedAt: timestamp } 
            : c
        )
      );
      
      toast({
        title: "Cliente atualizado",
        description: `O cliente foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Ocorreu um erro ao atualizar o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setClients((prev) => prev.filter((client) => client.id !== id));
      
      toast({
        title: "Cliente removido",
        description: `O cliente foi removido com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Erro ao remover cliente",
        description: "Ocorreu um erro ao remover o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
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
