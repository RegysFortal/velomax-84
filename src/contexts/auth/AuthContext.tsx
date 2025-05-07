
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { User, PermissionLevel } from '@/types';
import { useSupabaseUserManagement } from './useSupabaseUserManagement';
import { useAuthentication } from './useAuthentication';
import { AuthContextType } from './types';
import { createDefaultAdminUser, hasPermission } from './authUtils';
import { useAuthStateChange } from './useAuthStateChange';

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

  // Use our new hook to handle auth state changes
  useAuthStateChange({
    setUser,
    setSupabaseUser,
    setSession,
    setLoading
  });

  const { 
    users, 
    updateUser, 
    createUser, 
    deleteUser, 
    resetUserPassword,
    refreshUsers 
  } = useSupabaseUserManagement(user);

  // Create the context value with all required properties
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
    hasPermission: (feature: string, level?: keyof PermissionLevel) => 
      hasPermission(user, feature, level),
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
