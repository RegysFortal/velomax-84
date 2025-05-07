
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { User, PermissionLevel } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseUserManagement } from './useSupabaseUserManagement';
import { useAuthentication } from './useAuthentication';
import { AuthContextType } from './types';
import { createDefaultAdminUser } from './authUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with empty array, it will be populated in useEffect
  const [initialUsers, setInitialUsers] = React.useState<User[]>([]);
  
  // Load initial users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('velomax_users');
    if (storedUsers) {
      setInitialUsers(JSON.parse(storedUsers));
    } else {
      const defaultAdmin = createDefaultAdminUser();
      setInitialUsers([defaultAdmin]);
      localStorage.setItem('velomax_users', JSON.stringify([defaultAdmin]));
    }
  }, []);
  
  const { 
    user, 
    currentUser, 
    loading, 
    login, 
    logout, 
    updateUserProfile, 
    updateUserPassword,
    setUser,
    setSupabaseUser,
    setSession,
    setLoading,
    supabaseUser,
    session
  } = useAuthentication(initialUsers, (updatedUsers) => {
    setInitialUsers(updatedUsers);
    localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
  });

  const { 
    users, 
    updateUser, 
    createUser, 
    deleteUser, 
    resetUserPassword,
    refreshUsers 
  } = useSupabaseUserManagement(user);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          
          try {
            // Buscar informações do usuário no banco de dados
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (userError && userError.code !== 'PGRST116') {
              console.error("Erro ao buscar dados do usuário:", userError);
            }
            
            // Buscar permissões do usuário
            const { data: permissionsData, error: permissionsError } = await supabase
              .from('user_permissions')
              .select('*')
              .eq('user_id', session.user.id);
            
            if (permissionsError) {
              console.error("Erro ao buscar permissões do usuário:", permissionsError);
            }
            
            // Buscar papel (role) do usuário
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (roleError && roleError.code !== 'PGRST116') {
              console.error("Erro ao buscar papel do usuário:", roleError);
            }
            
            // Construir objeto de permissões
            const permissionsObj: Record<string, PermissionLevel> = {};
            if (permissionsData && permissionsData.length > 0) {
              permissionsData.forEach((perm: any) => {
                permissionsObj[perm.resource] = {
                  view: perm.view || false,
                  create: perm.create || false,
                  edit: perm.edit || false,
                  delete: perm.delete || false
                };
              });
            }
            
            // Fix type error: Cast the role string to the appropriate type
            const userRole = roleData?.role as 'user' | 'admin' | 'manager' | 'driver' | 'helper' || 'user';
            
            // Construir objeto de usuário completo
            const localUser: User = {
              id: session.user.id,
              name: userData?.name || session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
              username: userData?.username || session.user.email?.split('@')[0] || session.user.id,
              email: userData?.email || session.user.email || `${session.user.id}@velomax.com`,
              role: userRole,
              department: userData?.department,
              position: userData?.position,
              phone: userData?.phone,
              createdAt: userData?.created_at || new Date().toISOString(),
              updatedAt: userData?.updated_at || new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              permissions: permissionsObj
            };
            
            // Atualizar estado do usuário
            console.log("Usuário autenticado com dados completos:", localUser);
            setUser(localUser);
            localStorage.setItem('velomax_user', JSON.stringify(localUser));
            
            // Atualizar lista local de usuários
            const storedUsers = localStorage.getItem('velomax_users');
            let usersList = storedUsers ? JSON.parse(storedUsers) : [];
            
            const existingUserIndex = usersList.findIndex((u: User) => u.id === localUser.id);
            if (existingUserIndex >= 0) {
              usersList[existingUserIndex] = { ...localUser, lastLogin: new Date().toISOString() };
            } else {
              usersList.push(localUser);
            }
            
            localStorage.setItem('velomax_users', JSON.stringify(usersList));
            
          } catch (error) {
            console.error("Erro ao processar dados de autenticação:", error);
          }
        } else {
          setSupabaseUser(null);
          setUser(null);
          localStorage.removeItem('velomax_user');
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setLoading(false);
      } catch (error) {
        console.error('Failed to load auth state', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Implementamos a função hasPermission para usar o novo sistema de permissões detalhadas
  const hasPermission = (feature: string, level: keyof PermissionLevel = 'view') => {
    // Admins always have all permissions
    if (user?.role === 'admin') return true;
    
    // If user doesn't exist or doesn't have permissions, deny
    if (!user || !user.permissions) return false;
    
    // Check if the feature is in the user's permissions
    const permission = user.permissions[feature];
    
    // If permission doesn't exist, deny
    if (!permission) return false;
    
    // Check if permission is a boolean (old format) or an object (new format)
    if (typeof permission === 'boolean') {
      return permission;
    }
    
    // Return the specific level of permission
    return permission[level] || false;
  };

  const value: AuthContextType = {
    user,
    users,
    currentUser,
    login,
    logout,
    updateUserProfile,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    updateUserPassword,
    loading,
    hasPermission,
    supabaseUser,
    session,
    refreshUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
