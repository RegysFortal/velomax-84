
import { useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { mapAppUserToSupabase } from './userMappers';
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
      const supabaseUserData = mapAppUserToSupabase(userData);

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
        const { error: permError } = await supabase
          .from('user_permissions' as any)
          .update({ 
            permissions: supabaseUserData.permissions,
            updated_at: new Date().toISOString() 
          })
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
