
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useActivityLog } from './ActivityLogContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Initial user for demo purposes
const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addLog } = useActivityLog();
  
  useEffect(() => {
    // Check for existing user session in localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem('velomax_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          localStorage.removeItem('velomax_user');
        }
      }
      setLoading(false);
    };
    
    // Initialize users in localStorage if they don't exist
    const initUsers = () => {
      const storedUsers = localStorage.getItem('velomax_users');
      if (!storedUsers) {
        localStorage.setItem('velomax_users', JSON.stringify(INITIAL_USERS));
      }
    };
    
    initUsers();
    checkAuth();
  }, []);
  
  // Update local storage when user changes
  useEffect(() => {
    if (!loading) {
      if (user) {
        localStorage.setItem('velomax_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('velomax_user');
      }
    }
  }, [user, loading]);
  
  const login = async (email: string, password: string) => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUsers = localStorage.getItem('velomax_users');
      if (!storedUsers) {
        throw new Error('No users found');
      }
      
      const users = JSON.parse(storedUsers);
      const foundUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Credenciais inválidas');
      }
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      // Log login activity
      addLog({
        action: 'login',
        entityType: 'user',
        entityId: userWithoutPassword.id,
        entityName: userWithoutPassword.name,
        details: `Login bem-sucedido: ${userWithoutPassword.email}`
      });
      
      toast({
        title: 'Login Realizado',
        description: `Bem-vindo, ${foundUser.name}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Ocorreu um erro ao tentar fazer login.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  const logout = () => {
    // Log logout activity before clearing user
    if (user) {
      addLog({
        action: 'logout',
        entityType: 'user',
        entityId: user.id,
        entityName: user.name,
        details: `Logout: ${user.email}`
      });
    }
    
    setUser(null);
    toast({
      title: 'Logout Realizado',
      description: 'Você foi desconectado com sucesso.',
    });
    navigate('/login');
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error('Todos os campos são obrigatórios');
      }
      
      // Check if email is already registered
      const storedUsers = localStorage.getItem('velomax_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Este e-mail já está registrado');
      }
      
      // Create new user
      const newUser = {
        id: `user-${uuidv4()}`,
        name,
        email,
        password,
        role: 'user' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add new user to the users list
      const updatedUsers = [...users, newUser];
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      
      // Auto-login the new user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      
      // Log register activity
      addLog({
        action: 'register',
        entityType: 'user',
        entityId: newUser.id,
        entityName: newUser.name,
        details: `Novo usuário registrado: ${newUser.email}`
      });
      
      toast({
        title: 'Registro Concluído',
        description: 'Sua conta foi criada com sucesso!',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar',
        description: error.message || 'Ocorreu um erro ao tentar registrar.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user in state
      const updatedUser = { ...user, ...data, updatedAt: new Date().toISOString() };
      setUser(updatedUser);
      
      // Update user in localStorage
      const storedUsers = localStorage.getItem('velomax_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, ...data, updatedAt: new Date().toISOString() } : u
        );
        localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      }
      
      // Log profile update activity
      addLog({
        action: 'update',
        entityType: 'user',
        entityId: user.id,
        entityName: user.name,
        details: `Perfil atualizado: ${Object.keys(data).join(', ')}`
      });
      
      toast({
        title: 'Perfil Atualizado',
        description: 'Suas informações foram atualizadas com sucesso!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message || 'Ocorreu um erro ao tentar atualizar o perfil.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify current password
      const storedUsers = localStorage.getItem('velomax_users');
      if (!storedUsers) {
        throw new Error('Erro ao verificar senha atual');
      }
      
      const users = JSON.parse(storedUsers);
      const currentUser = users.find((u: any) => u.id === user.id);
      
      if (!currentUser || currentUser.password !== currentPassword) {
        throw new Error('Senha atual incorreta');
      }
      
      // Update password
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, password: newPassword, updatedAt: new Date().toISOString() } : u
      );
      
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      
      // Log password update activity
      addLog({
        action: 'update',
        entityType: 'user',
        entityId: user.id,
        entityName: user.name,
        details: 'Senha atualizada'
      });
      
      toast({
        title: 'Senha Atualizada',
        description: 'Sua senha foi alterada com sucesso!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar senha',
        description: error.message || 'Ocorreu um erro ao tentar atualizar a senha.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateUserProfile,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
