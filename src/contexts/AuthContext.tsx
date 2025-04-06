import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { useActivityLog } from './ActivityLogContext';

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userId: string, userData: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>> ) => Promise<User>;
  deleteUser: (userId: string) => boolean;
  resetUserPassword: (userId: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: 'admin' | 'manager' | 'user';
  permissions?: {
    deliveries?: boolean;
    shipments?: boolean;
    clients?: boolean;
    cities?: boolean;
    reports?: boolean;
    financial?: boolean;
    priceTables?: boolean;
    dashboard?: boolean;
    logbook?: boolean;
    employees?: boolean;
    vehicles?: boolean;
    maintenance?: boolean;
    settings?: boolean;
  };
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addLog: logActivity } = useActivityLog();

  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = localStorage.getItem('velomax_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const storedUsers = localStorage.getItem('velomax_users');
          if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
          }
      } catch (error) {
        console.error('Failed to load user from localStorage', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_users', JSON.stringify(users));
    }
  }, [users, loading]);

  const login = async (username: string, password: string) => {
    const storedUsers = localStorage.getItem('velomax_users');
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers);
      const foundUser = users.find(u => u.username === username);

      if (foundUser && password === 'password') { // TODO: Replace with real password check
        setUser(foundUser);
        localStorage.setItem('velomax_user', JSON.stringify(foundUser));

        // Update last login
        const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
        localStorage.setItem('velomax_user', JSON.stringify(updatedUser));

        // Update users array with lastLogin
        const updatedUsers = users.map(u => u.id === foundUser.id ? updatedUser : u);
        localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);

        logActivity({
          action: 'login',
          entityType: 'user',
          entityId: foundUser.id,
          entityName: foundUser.name,
          details: 'Usuário fez login no sistema'
        });

        navigate('/dashboard');
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('velomax_user');

    logActivity({
      action: 'logout',
      entityType: 'user',
      details: 'Usuário fez logout do sistema'
    });

    navigate('/login');
  };

  // Update user profile
  const updateUserProfile = async (userId: string, userData: Partial<User>) => {
    try {
      // Find the user to update
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("Usuário não encontrado");
      }
      
      // Create updated user
      const updatedUser = {
        ...users[userIndex],
        ...userData,
      };
      
      // Update users array
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      
      // Update localStorage
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      
      // Update state
      setUsers(updatedUsers);
      
      // If updating the current user, also update user state
      if (user && user.id === userId) {
        setUser(updatedUser);
        localStorage.setItem('velomax_user', JSON.stringify(updatedUser));
      }
      
      // Log activity
      logActivity({
        action: 'update',
        entityType: 'user',
        entityId: userId,
        entityName: updatedUser.name,
        details: 'Perfil de usuário atualizado'
      });
      
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  // Create a new user
  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      // Check if username already exists
      const existingUser = users.find(u => u.username === userData.username);
      
      if (existingUser) {
        throw new Error("Nome de usuário já está em uso");
      }
      
      // Create new user
      const newUser: User = {
        id: uuidv4(),
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      // Update users array
      const updatedUsers = [...users, newUser];
      
      // Update localStorage
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      
      // Update state
      setUsers(updatedUsers);
      
      // Log activity
      logActivity({
        action: 'create',
        entityType: 'user',
        entityId: newUser.id,
        entityName: newUser.name,
        details: 'Novo usuário criado'
      });
      
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  // Delete user
  const deleteUser = (userId: string) => {
    // Find user to delete
    const userToDelete = users.find(u => u.id === userId);
    
    if (!userToDelete) {
      throw new Error("Usuário não encontrado");
    }
    
    // Prevent deleting the current user
    if (user && user.id === userId) {
      throw new Error("Você não pode excluir seu próprio usuário");
    }
    
    // Update users array
    const updatedUsers = users.filter(u => u.id !== userId);
    
    // Update localStorage
    localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
    
    // Update state
    setUsers(updatedUsers);
    
    // Log activity
    logActivity({
      action: 'delete',
      entityType: 'user',
      entityId: userId,
      entityName: userToDelete.name,
      details: 'Usuário excluído'
    });
    
    return true;
  };

  // Reset user password
  const resetUserPassword = (userId: string, newPassword: string) => {
    // Find the user to update
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }
    
    // Create updated user
    const updatedUser = {
      ...users[userIndex],
      password: newPassword
    };
    
    // Update users array
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    
    // Update localStorage
    localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
    
    // Update state
    setUsers(updatedUsers);
    
    // Log activity
    logActivity({
      action: 'update',
      entityType: 'user',
      entityId: userId,
      entityName: updatedUser.name,
      details: 'Senha redefinida'
    });
    
    return true;
  };

  const value = {
    user,
    users,
    loading,
    login,
    logout,
    updateUserProfile,
    createUser,
    deleteUser,
    resetUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
