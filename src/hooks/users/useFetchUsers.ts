
import { useState } from 'react';
import { User, PermissionLevel } from '@/types';
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

      // Buscar usuários básicos
      const { data: usersData, error: usersError } = await supabase
        .from('users' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Buscar permissões para cada usuário
      const userIds = usersData.map((user: any) => user.id);
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('*')
        .in('user_id', userIds);

      if (permissionsError) {
        console.error("Erro ao buscar permissões:", permissionsError);
        // Continue mesmo com erro nas permissões
      }

      // Agrupar permissões por usuário
      const permissionsByUser: Record<string, Record<string, PermissionLevel>> = {};
      
      if (permissionsData) {
        permissionsData.forEach((perm: any) => {
          if (!permissionsByUser[perm.user_id]) {
            permissionsByUser[perm.user_id] = {};
          }
          
          permissionsByUser[perm.user_id][perm.resource] = {
            view: perm.view || false,
            create: perm.create || false,
            edit: perm.edit || false,
            delete: perm.delete || false
          };
        });
      }

      // Mapear os dados para o formato esperado pelo aplicativo
      const formattedUsers = (usersData as any[]).map(user => {
        return mapSupabaseUserToAppUser({
          ...user,
          permissions: permissionsByUser[user.id] || {}
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
