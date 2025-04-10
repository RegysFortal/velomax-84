
import { useState } from 'react';
import { Client } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseClientToClient, mapClientToSupabaseClient } from './clientsUtils';

export const useClientsOperations = (
  clients: Client[],
  setClients: React.Dispatch<React.SetStateAction<Client[]>>,
  user?: { id: string } | null
) => {
  const { toast } = useToast();
  
  const addClient = async (
    client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const timestamp = new Date().toISOString();
      
      // Prepare data for Supabase insert
      const supabaseClient = mapClientToSupabaseClient(client, user?.id);
      
      console.log("Inserting client with data:", supabaseClient);
      
      const { data, error } = await supabase
        .from('clients')
        .insert(supabaseClient)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      // Map the returned data to our Client type
      const newClient = mapSupabaseClientToClient(data);
      
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
      throw error; // Re-throw to be handled by the caller
    }
  };
  
  const updateClient = async (id: string, client: Partial<Client>): Promise<void> => {
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
      if (client.priceTableId !== undefined) {
        console.log("Setting price table ID in database to:", client.priceTableId);
        // Ensure empty string is converted to null for database
        supabaseClient.price_table_id = client.priceTableId === "" ? null : client.priceTableId;
      }
      if (client.notes !== undefined) supabaseClient.notes = client.notes;

      console.log("Updating client with data:", supabaseClient);

      const { error } = await supabase
        .from('clients')
        .update(supabaseClient)
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // Update client in local state
      setClients((prev) => {
        const updated = prev.map((c) => 
          c.id === id 
            ? { ...c, ...client, updatedAt: timestamp } 
            : c
        );
        console.log("Updated client state:", updated.find(c => c.id === id));
        return updated;
      });
      
      console.log("Cliente atualizado com sucesso");
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
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

  return {
    addClient,
    updateClient,
    deleteClient,
    getClient
  };
};
