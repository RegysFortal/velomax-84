import { useState } from 'react';
import { Client } from '@/types';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { UseClientsOperationsReturnType } from './types';

export const useClientsOperations = (
  clients: Client[],
  setClients: React.Dispatch<React.SetStateAction<Client[]>>,
  user: User | null
): UseClientsOperationsReturnType => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);
      const timestamp = new Date().toISOString();
      const newClient: Client = {
        ...clientData,
        id: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      // Add to Supabase if user is logged in
      if (user) {
        const { error } = await supabase
          .from('clients')
          .insert({
            id: newClient.id,
            name: newClient.name,
            email: newClient.email,
            phone: newClient.phone,
            document: newClient.document,
            address: newClient.address,
            contact: newClient.contact,
            price_table_id: newClient.priceTableId,
            notes: newClient.notes,
            user_id: user.id,
            created_at: timestamp,
            updated_at: timestamp,
          });
        
        if (error) {
          throw error;
        }
      }
      
      setClients(prev => [...prev, newClient]);
      
      toast({
        title: "Cliente adicionado",
        description: `${newClient.name} foi adicionado com sucesso.`
      });
      
      // Don't return any value (void)
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Ocorreu um erro ao adicionar o cliente. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const updateClient = async (id: string, clientUpdate: Partial<Client>): Promise<void> => {
    try {
      setLoading(true);
      const updatedAt = new Date().toISOString();
      
      // Update in Supabase if user is logged in
      if (user) {
        const updateData: any = {
          ...clientUpdate,
          updated_at: updatedAt
        };
        
        // Convert camelCase to snake_case for Supabase
        if ('contact' in clientUpdate) {
          updateData.contact_person = clientUpdate.contact;
        }
        
        if ('priceTableId' in clientUpdate) {
          updateData.price_table_id = clientUpdate.priceTableId;
          delete updateData.priceTableId;
        }
        
        const { error } = await supabase
          .from('clients')
          .update(updateData)
          .eq('id', id);
        
        if (error) {
          throw error;
        }
      }
      
      setClients(prev => 
        prev.map(client => 
          client.id === id 
            ? { ...client, ...clientUpdate, updatedAt }
            : client
        )
      );
      
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso."
      });
      
      // Don't return any value (void)
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Ocorreu um erro ao atualizar o cliente. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteClient = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Delete from Supabase if user is logged in
      if (user) {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
      }
      
      setClients(prev => prev.filter(client => client.id !== id));
      
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso."
      });
      
      // Don't return any value (void)
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao remover cliente",
        description: "Ocorreu um erro ao remover o cliente. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const getClient = (id: string): Client | undefined => {
    return clients.find(client => client.id === id);
  };
  
  return {
    addClient,
    updateClient,
    deleteClient,
    getClient,
  };
};
