
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useUserManagement } from './useUserManagement';
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
    hasPermission,
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
    resetUserPassword 
  } = useUserManagement(user);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          
          const storedUsers = localStorage.getItem('velomax_users');
          const usersList = storedUsers ? JSON.parse(storedUsers) : [];
          
          let localUser = usersList.find((u: User) => u.email === session.user.email);
          
          if (!localUser) {
            localUser = {
              id: session.user.id,
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
              username: session.user.email?.split('@')[0] || session.user.id,
              email: session.user.email || `${session.user.id}@velomax.com`,
              role: 'admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              permissions: {
                deliveries: true,
                shipments: true,
                clients: true,
                cities: true,
                reports: true,
                financial: true,
                priceTables: true,
                dashboard: true,
                logbook: true,
                employees: true,
                vehicles: true,
                maintenance: true,
                settings: true,
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

  const value: AuthContextType = {
    user,
    users: initialUsers, // Use initialUsers instead of users from useUserManagement
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
