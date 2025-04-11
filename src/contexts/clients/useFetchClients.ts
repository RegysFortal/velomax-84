
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
        
        // Try to load from localStorage first as a quick initial load
        const storedClients = localStorage.getItem('velomax_clients');
        let localClientsLoaded = false;
        
        if (storedClients) {
          try {
            const parsedClients = JSON.parse(storedClients);
            if (Array.isArray(parsedClients) && parsedClients.length > 0) {
              console.log("Loaded", parsedClients.length, "clients from localStorage initially");
              setClients(parsedClients);
              localClientsLoaded = true;
            }
          } catch (error) {
            console.error('Failed to parse stored clients', error);
          }
        }
        
        // Then try to fetch from Supabase
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Map Supabase data to match our Client type
          const mappedClients = data.map(mapSupabaseClientToClient);
          
          setClients(mappedClients);
          console.log("Successfully loaded", mappedClients.length, "clients from database");
          
          // Save to localStorage for offline access
          localStorage.setItem('velomax_clients', JSON.stringify(mappedClients));
        } else if (!localClientsLoaded) {
          // If no clients from Supabase and none from localStorage, use initial clients
          console.log("No clients found in database, using initial clients");
          setClients(INITIAL_CLIENTS);
          
          // Save initial clients to localStorage
          localStorage.setItem('velomax_clients', JSON.stringify(INITIAL_CLIENTS));
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        
        if (!localClientsLoaded) {
          toast({
            title: "Erro ao carregar clientes",
            description: "Usando dados locais como fallback.",
            variant: "destructive"
          });
          
          // Load from localStorage as fallback if not already loaded
          const storedClients = localStorage.getItem('velomax_clients');
          if (storedClients) {
            try {
              const parsedClients = JSON.parse(storedClients);
              console.log("Loaded", parsedClients.length, "clients from localStorage as fallback");
              setClients(parsedClients);
            } catch (error) {
              console.error('Failed to parse stored clients', error);
              console.log("Using initial clients fallback");
              setClients(INITIAL_CLIENTS);
            }
          } else {
            console.log("No stored clients found, using initial clients fallback");
            setClients(INITIAL_CLIENTS);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [toast, user]);

  return { clients, setClients, loading };
};
