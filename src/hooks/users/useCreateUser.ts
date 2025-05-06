
import { useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapSupabaseUserToAppUser } from './userMappers';

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      console.log("Criando novo usuário no Supabase:", userData);
      
      // Verificar se já existe um usuário com o mesmo email ou username
      const { data: existingUsers, error: checkError } = await supabase
        .from('users' as any)
        .select('email, username')
        .or(`email.eq.${userData.email},username.eq.${userData.username}`);
      
      if (checkError) throw checkError;
      
      // Type assertion for more aggressive type safety
      const typedExistingUsers = (existingUsers as any[]) || [];
      
      if (typedExistingUsers.length > 0) {
        if (typedExistingUsers.some((u: any) => u.email === userData.email)) {
          throw new Error('Email já está em uso');
        }
        if (typedExistingUsers.some((u: any) => u.username === userData.username)) {
          throw new Error('Nome de usuário já está em uso');
        }
      }

      // Formatamos os dados do usuário para o formato Supabase
      const supabaseUserData = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'user',
        department: userData.department,
        position: userData.position,
        phone: userData.phone
      };

      // Inserir usuário na tabela users
      const { data: newUser, error: userError } = await supabase
        .from('users' as any)
        .insert(supabaseUserData)
        .select()
        .single();

      if (userError) throw userError;

      if (!newUser) throw new Error('Falha ao criar usuário');

      // Formatamos as permissões para o Supabase
      if (userData.permissions) {
        const permissionsData = {
          user_id: (newUser as any).id,
          deliveries: userData.permissions.deliveries || false,
          shipments: userData.permissions.shipments || false,
          clients: userData.permissions.clients || false,
          cities: userData.permissions.cities || false,
          reports: userData.permissions.reports || false,
          financial: userData.permissions.financial || false,
          price_tables: userData.permissions.priceTables || false,
          dashboard: userData.permissions.dashboard || true,
          logbook: userData.permissions.logbook || false,
          employees: userData.permissions.employees || false,
          vehicles: userData.permissions.vehicles || false,
          maintenance: userData.permissions.maintenance || false,
          settings: userData.permissions.settings || false
        };

        // Inserir permissões na tabela user_permissions
        const { error: permError } = await supabase
          .from('user_permissions' as any)
          .insert(permissionsData);

        if (permError) {
          console.error("Erro ao criar permissões:", permError);
          // Não vamos falhar aqui porque o trigger pode ter cuidado disso
        }
      }

      // Mapear o usuário para o formato da aplicação
      return mapSupabaseUserToAppUser({
        ...(newUser as any),
        permissions: userData.permissions 
      });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao criar usuário";
      toast.error("Erro ao criar usuário", {
        description: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading };
};
