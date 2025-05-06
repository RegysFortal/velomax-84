
import { useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      console.log("Atualizando usuário no Supabase:", userId, userData);
      
      // Se estamos atualizando o email ou username, verificamos duplicatas
      if (userData.email || userData.username) {
        const checkQuery = supabase
          .from('users' as any)
          .select('email, username')
          .neq('id', userId);
        
        let queryStr = '';
        
        if (userData.email) {
          queryStr = `email.eq.${userData.email}`;
        }
        
        if (userData.username) {
          queryStr = queryStr ? `${queryStr},username.eq.${userData.username}` : `username.eq.${userData.username}`;
        }
        
        const { data: existingUsers, error: checkError } = await checkQuery
          .or(queryStr);
        
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
      }

      // Formatamos os dados do usuário para o formato Supabase
      const supabaseUserData: any = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        position: userData.position,
        phone: userData.phone,
        updated_at: new Date().toISOString()
      };

      // Remover campos undefined
      Object.keys(supabaseUserData).forEach(key => 
        supabaseUserData[key] === undefined && delete supabaseUserData[key]
      );

      // Atualizar usuário na tabela users
      const { data: updatedUser, error: userError } = await supabase
        .from('users' as any)
        .update(supabaseUserData)
        .eq('id', userId)
        .select()
        .single();

      if (userError) throw userError;

      // Atualizar permissões se fornecidas
      if (userData.permissions) {
        const permissionsData: any = {
          deliveries: userData.permissions.deliveries,
          shipments: userData.permissions.shipments,
          clients: userData.permissions.clients,
          cities: userData.permissions.cities,
          reports: userData.permissions.reports,
          financial: userData.permissions.financial,
          price_tables: userData.permissions.priceTables,
          dashboard: userData.permissions.dashboard,
          logbook: userData.permissions.logbook,
          employees: userData.permissions.employees,
          vehicles: userData.permissions.vehicles,
          maintenance: userData.permissions.maintenance,
          settings: userData.permissions.settings,
          updated_at: new Date().toISOString()
        };

        // Remover campos undefined
        Object.keys(permissionsData).forEach(key => 
          permissionsData[key] === undefined && delete permissionsData[key]
        );

        const { error: permError } = await supabase
          .from('user_permissions' as any)
          .update(permissionsData)
          .eq('user_id', userId);

        if (permError) {
          console.error("Erro ao atualizar permissões:", permError);
          throw permError;
        }
      }

      return true;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao atualizar usuário";
      toast.error("Erro ao atualizar usuário", {
        description: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading };
};
