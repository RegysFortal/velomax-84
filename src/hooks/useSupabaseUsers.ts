
import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from 'sonner';

// Mapeia um usuário do Supabase para nosso tipo User
const mapSupabaseUserToAppUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    name: supabaseUser.name || '',
    username: supabaseUser.username || '',
    email: supabaseUser.email || '',
    role: supabaseUser.role || 'user',
    department: supabaseUser.department || '',
    position: supabaseUser.position || '',
    phone: supabaseUser.phone || '',
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at,
    // Mapeie as permissões do objeto permissions do banco para o nosso formato
    permissions: supabaseUser.permissions ? {
      deliveries: supabaseUser.permissions.deliveries || false,
      shipments: supabaseUser.permissions.shipments || false,
      clients: supabaseUser.permissions.clients || false,
      cities: supabaseUser.permissions.cities || false,
      reports: supabaseUser.permissions.reports || false,
      financial: supabaseUser.permissions.financial || false,
      priceTables: supabaseUser.permissions.price_tables || false,
      dashboard: supabaseUser.permissions.dashboard || true,
      logbook: supabaseUser.permissions.logbook || false,
      employees: supabaseUser.permissions.employees || false,
      vehicles: supabaseUser.permissions.vehicles || false,
      maintenance: supabaseUser.permissions.maintenance || false,
      settings: supabaseUser.permissions.settings || false,
    } : {
      deliveries: false,
      shipments: false,
      clients: false,
      cities: false,
      reports: false,
      financial: false,
      priceTables: false,
      dashboard: true,
      logbook: false,
      employees: false,
      vehicles: false,
      maintenance: false,
      settings: false,
    }
  };
};

export const useSupabaseUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar usuários do Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using supabase.rpc() for a custom function or supabase.auth.admin to get users
      // Since we're working with non-standard tables, we need to use a more flexible approach
      const { data, error } = await supabase
        .from('users' as any)
        .select(`
          *,
          permissions:user_permissions(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear os dados para o formato esperado pelo aplicativo
      const formattedUsers = data.map(user => {
        // Para cada usuário, pegamos as permissões (se existirem) e as formatamos
        const permissions = user.permissions && user.permissions.length > 0 
          ? user.permissions[0] 
          : null;

        return mapSupabaseUserToAppUser({
          ...user,
          permissions
        });
      });

      setUsers(formattedUsers);
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
          setUsers(parsedUsers);
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

  // Função para criar um novo usuário no Supabase
  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log("Criando novo usuário no Supabase:", userData);
      
      // Verificar se já existe um usuário com o mesmo email ou username
      // Using a parameterized approach instead of string interpolation
      const { data: existingUsers, error: checkError } = await supabase
        .from('users' as any)
        .select('email, username')
        .or(`email.eq.${userData.email},username.eq.${userData.username}`);
      
      if (checkError) throw checkError;
      
      // Type assertion to handle the type checking
      const typedExistingUsers = existingUsers as Array<{email: string, username: string}>;
      
      if (typedExistingUsers && typedExistingUsers.length > 0) {
        if (typedExistingUsers.some(u => u.email === userData.email)) {
          throw new Error('Email já está em uso');
        }
        if (typedExistingUsers.some(u => u.username === userData.username)) {
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
          user_id: newUser.id,
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

      // Recarregamos a lista de usuários para ter os dados mais recentes
      await fetchUsers();

      // Mapear o usuário para o formato da aplicação
      return mapSupabaseUserToAppUser({
        ...newUser,
        permissions: userData.permissions 
      });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao criar usuário";
      toast.error("Erro ao criar usuário", {
        description: errorMessage
      });
      throw err;
    }
  };

  // Função para atualizar um usuário no Supabase
  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
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
        
        // Type assertion to handle the type checking
        const typedExistingUsers = existingUsers as Array<{email: string, username: string}>;
        
        if (typedExistingUsers && typedExistingUsers.length > 0) {
          if (typedExistingUsers.some(u => u.email === userData.email)) {
            throw new Error('Email já está em uso');
          }
          if (typedExistingUsers.some(u => u.username === userData.username)) {
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

      // Recarregar a lista de usuários
      await fetchUsers();

      return true;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao atualizar usuário";
      toast.error("Erro ao atualizar usuário", {
        description: errorMessage
      });
      throw err;
    }
  };

  // Função para excluir um usuário do Supabase
  const deleteUser = async (userId: string) => {
    try {
      console.log("Excluindo usuário do Supabase:", userId);

      // Excluir usuário (as permissões serão excluídas automaticamente por causa do CASCADE)
      const { error } = await supabase
        .from('users' as any)
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Atualizar o estado local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast.success("Usuário excluído com sucesso");
      return true;
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao excluir usuário";
      toast.error("Erro ao excluir usuário", {
        description: errorMessage
      });
      throw err;
    }
  };

  // Carregar usuários automaticamente quando o hook é inicializado
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
