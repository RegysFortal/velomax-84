
import { useState } from 'react';
import { Client } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';

export function useClientsOperations(
  clients: Client[],
  setClients: React.Dispatch<React.SetStateAction<Client[]>>,
  user: SupabaseUser | null | undefined
) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);

      // Get current user for user_id field
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          trading_name: clientData.tradingName,
          document: clientData.document,
          email: clientData.email,
          phone: clientData.phone,
          contact: clientData.contact,
          street: clientData.street,
          number: clientData.number,
          complement: clientData.complement,
          neighborhood: clientData.neighborhood,
          city: clientData.city,
          state: clientData.state,
          zip_code: clientData.zipCode,
          price_table_id: clientData.priceTableId,
          notes: clientData.notes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newClient: Client = {
        id: data.id,
        name: data.name,
        tradingName: data.trading_name,
        document: data.document,
        email: data.email,
        phone: data.phone,
        contact: data.contact,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        priceTableId: data.price_table_id,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setClients(prev => [...prev, newClient]);
      
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso."
      });
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
    try {
      setLoading(true);

      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.tradingName !== undefined) updateData.trading_name = updates.tradingName;
      if (updates.document !== undefined) updateData.document = updates.document;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.contact !== undefined) updateData.contact = updates.contact;
      if (updates.street !== undefined) updateData.street = updates.street;
      if (updates.number !== undefined) updateData.number = updates.number;
      if (updates.complement !== undefined) updateData.complement = updates.complement;
      if (updates.neighborhood !== undefined) updateData.neighborhood = updates.neighborhood;
      if (updates.city !== undefined) updateData.city = updates.city;
      if (updates.state !== undefined) updateData.state = updates.state;
      if (updates.zipCode !== undefined) updateData.zip_code = updates.zipCode;
      if (updates.priceTableId !== undefined) updateData.price_table_id = updates.priceTableId;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setClients(prev => 
        prev.map(client => 
          client.id === id 
            ? { ...client, ...updates, updatedAt: updateData.updated_at }
            : client
        )
      );

      toast({
        title: "Cliente atualizado",
        description: "O cliente foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente. Tente novamente.",
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

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setClients(prev => prev.filter(client => client.id !== id));
      
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente. Tente novamente.",
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
    loading
  };
}
