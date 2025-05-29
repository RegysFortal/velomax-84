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
          
          // Verificar se o usuário existe na tabela users
          const { data: existingUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error && error.code === 'PGRST116') {
            // Usuário não existe na tabela users, criar um novo
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
                role: session.user.email === 'reginaldo@velomax.com.br' ? 'admin' : 'user'
              });

            if (insertError) {
              console.error('Error creating user:', insertError);
            }
          }
          
          const storedUsers = localStorage.getItem('velomax_users');
          const usersList = storedUsers ? JSON.parse(storedUsers) : [];
          
          let localUser = usersList.find((u: User) => u.email === session.user.email);
          
          if (!localUser) {
            localUser = {
              id: session.user.id,
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
              username: session.user.email?.split('@')[0] || session.user.id,
              email: session.user.email || `${session.user.id}@velomax.com`,
              role: session.user.email === 'reginaldo@velomax.com.br' ? 'admin' : 'user',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              permissions: {
                deliveries: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                shipments: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                clients: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                cities: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                reports: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                financial: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                priceTables: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                dashboard: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                logbook: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                employees: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                vehicles: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                maintenance: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
                settings: { view: true, create: true, edit: true, delete: session.user.email === 'reginaldo@velomax.com.br' },
              }
            };
            
            usersList.push(localUser);
            localStorage.setItem('velomax_users', JSON.stringify(usersList));
          } else {
            const updatedUsers = usersList.map((u: User) => 
              u.id === localUser.id 
                ? { ...u, lastLogin: new Date().toISOString() } 
                : u
            );
            localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
          }
          
          setUser(localUser);
          localStorage.setItem('velomax_user', JSON.stringify(localUser));
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
