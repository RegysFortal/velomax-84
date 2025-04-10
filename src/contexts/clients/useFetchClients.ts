
import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { INITIAL_CLIENTS, mapSupabaseClientToClient } from './clientsUtils';

export const useFetchClients = (user?: { id: string } | null) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
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
        const mappedClients = data.map(mapSupabaseClientToClient);
        
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

  return { clients, setClients, loading };
};
