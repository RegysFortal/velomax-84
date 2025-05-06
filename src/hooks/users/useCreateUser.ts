
import { useState } from 'react';
import { User, PermissionLevel } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapAppUserToSupabase } from './userMappers';

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      console.log("Criando novo usuário no Supabase:", userData);
      
      // Verificar se email ou username já existem
      const { data: existingUsers, error: checkError } = await supabase
        .from('users' as any)
        .select('email, username')
        .or(`email.eq.${userData.email},username.eq.${userData.username}`);
      
      if (checkError) throw checkError;
      
      if (existingUsers && existingUsers.length > 0) {
        // Verifica qual campo está duplicado
        if (existingUsers.some((user: any) => user.email === userData.email)) {
          throw new Error('Email já está em uso');
        }
        if (existingUsers.some((user: any) => user.username === userData.username)) {
          throw new Error('Nome de usuário já está em uso');
        }
      }
      
      // Formatar dados para o formato Supabase
      const supabaseUserData = mapAppUserToSupabase(userData);
      
      // Criar o usuário
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          username: userData.username,
        }
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Falha ao criar usuário');
      }
      
      // Inserir no banco de dados as informações adicionais do usuário
      const { data: insertedUser, error: insertError } = await supabase
        .from('users' as any)
        .insert({
          ...supabaseUserData,
          id: data.user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // Inserir as permissões detalhadas para este usuário
      if (userData.permissions) {
        const permissionsToInsert = Object.entries(userData.permissions).map(([resource, levels]) => {
          // Verificar se é o formato antigo (boolean) ou novo (PermissionLevel)
          if (typeof levels === 'boolean') {
            // Converter boolean para o novo formato
            return {
              user_id: data.user.id,
              resource,
              view: levels,
              create: levels,
              edit: levels,
              delete: levels
            };
          } else {
            // Já está no novo formato
            return {
              user_id: data.user.id,
              resource,
              view: levels.view || false,
              create: levels.create || false,
              edit: levels.edit || false,
              delete: levels.delete || false
            };
          }
        });
        
        if (permissionsToInsert.length > 0) {
          const { error: permError } = await supabase
            .from('user_permissions')
            .insert(permissionsToInsert);
            
          if (permError) {
            console.error('Erro ao inserir permissões:', permError);
            throw permError;
          }
        }
      }
      
      // Retornar o usuário criado no formato apropriado
      return {
        id: data.user.id,
        email: userData.email,
        name: userData.name,
        username: userData.username,
        role: userData.role,
        department: userData.department,
        position: userData.position,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: userData.permissions
      } as User;
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
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
