
import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UseFetchClientsReturnType } from './types';

export function useFetchClients(user: SupabaseUser | null | undefined): UseFetchClientsReturnType {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const mappedClients = data.map((client: any): Client => ({
        id: client.id,
        name: client.name,
        tradingName: client.trading_name,
        document: client.document,
        email: client.email,
        phone: client.phone,
        contact: client.contact,
        street: client.street,
        number: client.number,
        complement: client.complement,
        neighborhood: client.neighborhood,
        city: client.city,
        state: client.state,
        zipCode: client.zip_code,
        priceTableId: client.price_table_id,
        notes: client.notes,
        createdAt: client.created_at,
        updatedAt: client.updated_at
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
          const parsed = JSON.parse(storedClients);
          setClients(parsed);
        } catch (error) {
          console.error('Failed to parse stored clients', error);
          setClients([]);
        }
      } else {
        setClients([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Save clients to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_clients', JSON.stringify(clients));
    }
  }, [clients, loading]);

  return {
    clients,
    setClients,
    loading
  };
}
