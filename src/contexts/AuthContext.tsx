import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
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
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetUserPassword: (userId: string, newPassword: string) => Promise<void>;
  createUser: (name: string, email: string, password: string, role: 'admin' | 'user' | 'manager') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  
  // Access ActivityLogContext
  let activityLog = null;
  try {
    activityLog = useActivityLog();
  } catch (error) {
    console.log('ActivityLogContext not available yet');
  }
  
  // Function to safely log activities
  const logActivity = (params: any) => {
    if (activityLog) {
      try {
        activityLog.addLog({ 
          ...params,
          userId: user?.id,
          userName: user?.name
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
    } else {
      // Queue activity logs for when the context becomes available
      console.log('Activity logging not available yet, activity will not be logged:', params);
    }
  };
  
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
        setUsers(INITIAL_USERS);
      } else {
        try {
          setUsers(JSON.parse(storedUsers));
        } catch (e) {
          console.error('Failed to parse stored users:', e);
          localStorage.setItem('velomax_users', JSON.stringify(INITIAL_USERS));
          setUsers(INITIAL_USERS);
        }
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
      logActivity({
        action: 'login',
        entityType: 'user',
        entityId: userWithoutPassword.id,
        entityName: userWithoutPassword.name,
        details: `Login bem-sucedido: ${userWithoutPassword.email}`
      });
      
      uiToast({
        title: 'Login Realizado',
        description: `Bem-vindo, ${foundUser.name}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      uiToast({
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
      logActivity({
        action: 'logout',
        entityType: 'user',
        entityId: user.id,
        entityName: user.name,
        details: `Logout: ${user.email}`
      });
    }
    
    setUser(null);
    uiToast({
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
      logActivity({
        action: 'register',
        entityType: 'user',
        entityId: newUser.id,
        entityName: newUser.name,
        details: `Novo usuário registrado: ${newUser.email}`
      });
      
      uiToast({
        title: 'Registro Concluído',
        description: 'Sua conta foi criada com sucesso!',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      uiToast({
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
        const allUsers = JSON.parse(storedUsers);
        const updatedUsers = allUsers.map((u: any) => 
          u.id === user.id ? { ...u, ...data, updatedAt: new Date().toISOString() } : u
        );
        localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
      }
      
      // Log profile update activity
      logActivity({
        action: 'update',
        entityType: 'user',
        entityId: user.id,
        entityName: user.name,
        details: `Perfil atualizado: ${Object.keys(data).join(', ')}`
      });
      
      uiToast({
        title: 'Perfil Atualizado',
        description: 'Suas informações foram atualizadas com sucesso!',
      });
    } catch (error: any) {
      uiToast({
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
      
      const allUsers = JSON.parse(storedUsers);
      const currentUser = allUsers.find((u: any) => u.id === user.id);
      
      if (!currentUser || currentUser.password !== currentPassword) {
        throw new Error('Senha atual incorreta');
      }
      
      // Update password
      const updatedUsers = allUsers.map((u: any) => 
        u.id === user.id ? { ...u, password: newPassword, updatedAt: new Date().toISOString() } : u
      );
      
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      // Log password update activity
      logActivity({
        action: 'update',
        entityType: 'user',
        entityId: user.id,
        entityName: user.name,
        details: 'Senha atualizada'
      });
      
      uiToast({
        title: 'Senha Atualizada',
        description: 'Sua senha foi alterada com sucesso!',
      });
    } catch (error: any) {
      uiToast({
        title: 'Erro ao atualizar senha',
        description: error.message || 'Ocorreu um erro ao tentar atualizar a senha.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  // New function for admin to reset a user's password
  const resetUserPassword = async (userId: string, newPassword: string) => {
    try {
      if (!user || user.role !== 'admin') {
        throw new Error('Permissão negada');
      }
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUsers = localStorage.getItem('velomax_users');
      if (!storedUsers) {
        throw new Error('Erro ao buscar usuários');
      }
      
      const allUsers = JSON.parse(storedUsers);
      const targetUser = allUsers.find((u: any) => u.id === userId);
      
      if (!targetUser) {
        throw new Error('Usuário não encontrado');
      }
      
      // Update password
      const updatedUsers = allUsers.map((u: any) => 
        u.id === userId ? { ...u, password: newPassword, updatedAt: new Date().toISOString() } : u
      );
      
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      // Log password reset activity
      logActivity({
        action: 'password_reset',
        entityType: 'user',
        entityId: userId,
        entityName: targetUser.name,
        details: `Senha redefinida pelo administrador ${user.name}`
      });
      
      uiToast({
        title: 'Senha Redefinida',
        description: `A senha do usuário ${targetUser.name} foi redefinida com sucesso!`,
      });
    } catch (error: any) {
      uiToast({
        title: 'Erro ao redefinir senha',
        description: error.message || 'Ocorreu um erro ao tentar redefinir a senha.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  // New function to create a user (admin only)
  const createUser = async (name: string, email: string, password: string, role: 'admin' | 'user' | 'manager') => {
    try {
      if (!user || user.role !== 'admin') {
        throw new Error('Permissão negada');
      }
      
      // Validate inputs
      if (!name || !email || !password || !role) {
        throw new Error('Todos os campos são obrigatórios');
      }
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUsers = localStorage.getItem('velomax_users');
      const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email already exists
      if (allUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Este e-mail já está em uso');
      }
      
      // Create new user
      const newUser = {
        id: `user-${uuidv4()}`,
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to users list
      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      // Log user creation
      logActivity({
        action: 'create',
        entityType: 'user',
        entityId: newUser.id,
        entityName: newUser.name,
        details: `Novo usuário criado com função: ${role}`
      });
      
      uiToast({
        title: 'Usuário Criado',
        description: `O usuário ${name} foi criado com sucesso!`,
      });
    } catch (error: any) {
      uiToast({
        title: 'Erro ao criar usuário',
        description: error.message || 'Ocorreu um erro ao tentar criar o usuário.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  // New function to delete a user (admin only)
  const deleteUser = async (userId: string) => {
    try {
      if (!user || user.role !== 'admin') {
        throw new Error('Permissão negada');
      }
      
      if (userId === user.id) {
        throw new Error('Você não pode excluir seu próprio usuário');
      }
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUsers = localStorage.getItem('velomax_users');
      if (!storedUsers) {
        throw new Error('Erro ao buscar usuários');
      }
      
      const allUsers = JSON.parse(storedUsers);
      const targetUser = allUsers.find((u: any) => u.id === userId);
      
      if (!targetUser) {
        throw new Error('Usuário não encontrado');
      }
      
      // Remove user
      const updatedUsers = allUsers.filter((u: any) => u.id !== userId);
      
      if (updatedUsers.length === 0 || !updatedUsers.some((u: any) => u.role === 'admin')) {
        throw new Error('Não é possível excluir o último administrador');
      }
      
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      // Log user deletion
      logActivity({
        action: 'delete',
        entityType: 'user',
        entityId: userId,
        entityName: targetUser.name,
        details: `Usuário excluído pelo administrador ${user.name}`
      });
      
      uiToast({
        title: 'Usuário Excluído',
        description: `O usuário ${targetUser.name} foi excluído com sucesso!`,
      });
    } catch (error: any) {
      uiToast({
        title: 'Erro ao excluir usuário',
        description: error.message || 'Ocorreu um erro ao tentar excluir o usuário.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        login,
        logout,
        register,
        updateUserProfile,
        updateUserPassword,
        resetUserPassword,
        createUser,
        deleteUser,
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
