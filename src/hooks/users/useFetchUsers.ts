
import { useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapSupabaseUserToAppUser } from './userMappers';

export const useFetchUsers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<User[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('users' as any)
        .select(`
          *,
          permissions:user_permissions(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear os dados para o formato esperado pelo aplicativo
      const formattedUsers = (data as any[]).map(user => {
        // Para cada usuário, pegamos as permissões (se existirem) e as formatamos
        const permissions = user.permissions && user.permissions.length > 0 
          ? user.permissions[0] 
          : null;

        return mapSupabaseUserToAppUser({
          ...user,
          permissions
        });
      });

      console.log("Usuários carregados do Supabase:", formattedUsers);
      return formattedUsers;
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao buscar usuários";
      setError(errorMessage);
      toast.error("Erro ao carregar usuários", {
        description: errorMessage
      });
      
      // Tentar usar usuários do localStorage como fallback
      const storedUsers = localStorage.getItem('velomax_users');
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers);
          return parsedUsers;
        } catch (parseErr) {
          console.error("Erro ao analisar usuários armazenados:", parseErr);
        }
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchUsers, loading, error };
};
