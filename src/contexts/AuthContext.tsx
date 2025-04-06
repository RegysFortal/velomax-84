import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  users: User[];
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => Promise<User>;
  deleteUser: (userId: string) => boolean;
  resetUserPassword: (userId: string, newPassword: string) => boolean;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        } else {
          const defaultAdmin: User = {
            id: uuidv4(),
            name: 'Administrador',
            username: 'admin',
            email: 'admin@velomax.com',
            role: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
          
          setUsers([defaultAdmin]);
          localStorage.setItem('velomax_users', JSON.stringify([defaultAdmin]));
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
    try {
      const foundUser = users.find(u => u.username === username);
      
      if (!foundUser) {
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha incorretos",
          variant: "destructive",
        });
        return false;
      }

      const updatedUser = { 
        ...foundUser, 
        lastLogin: new Date().toISOString() 
      };
      
      setUser(updatedUser);
      localStorage.setItem('velomax_user', JSON.stringify(updatedUser));

      const updatedUsers = users.map(u => u.id === foundUser.id ? updatedUser : u);
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      try {
        const logActivity = (activity: any) => {
          const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
          const newLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            userId: foundUser.id,
            userName: foundUser.name,
            ...activity
          };
          logs.push(newLog);
          localStorage.setItem('activity_logs', JSON.stringify(logs));
        };

        logActivity({
          action: 'login',
          entityType: 'user',
          entityId: foundUser.id,
          entityName: foundUser.name,
          details: 'Usuário fez login no sistema'
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${foundUser.name}!`,
      });
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro no sistema",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    if (user) {
      try {
        const logActivity = (activity: any) => {
          const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
          const newLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            ...activity
          };
          logs.push(newLog);
          localStorage.setItem('activity_logs', JSON.stringify(logs));
        };

        logActivity({
          action: 'logout',
          entityType: 'user',
          details: 'Usuário fez logout do sistema'
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
    }

    setUser(null);
    localStorage.removeItem('velomax_user');
    navigate('/login');
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("Usuário não encontrado");
      }
      
      const updatedUser = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      
      setUsers(updatedUsers);
      
      if (user && user.id === user.id) {
        setUser(updatedUser);
        localStorage.setItem('velomax_user', JSON.stringify(updatedUser));
      }
      
      try {
        const logActivity = (activity: any) => {
          const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
          const newLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            ...activity
          };
          logs.push(newLog);
          localStorage.setItem('activity_logs', JSON.stringify(logs));
        };

        logActivity({
          action: 'update',
          entityType: 'user',
          entityId: user.id,
          entityName: updatedUser.name,
          details: 'Perfil de usuário atualizado'
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("Usuário não encontrado");
      }
      
      const updatedUser = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      
      setUsers(updatedUsers);
      
      if (user && user.id === userId) {
        setUser(updatedUser);
        localStorage.setItem('velomax_user', JSON.stringify(updatedUser));
      }
      
      if (user) {
        try {
          const logActivity = (activity: any) => {
            const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
            const newLog = {
              id: uuidv4(),
              timestamp: new Date().toISOString(),
              userId: user.id,
              userName: user.name,
              ...activity
            };
            logs.push(newLog);
            localStorage.setItem('activity_logs', JSON.stringify(logs));
          };

          logActivity({
            action: 'update',
            entityType: 'user',
            entityId: userId,
            entityName: updatedUser.name,
            details: 'Perfil de usuário atualizado'
          });
        } catch (error) {
          console.error('Failed to log activity:', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      if (currentPassword !== 'password') {
        throw new Error("Senha atual incorreta");
      }
      
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("Usuário não encontrado");
      }
      
      const updatedUser = {
        ...users[userIndex],
        // password would be stored here if we were implementing real auth
      };
      
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      
      setUsers(updatedUsers);
      
      try {
        const logActivity = (activity: any) => {
          const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
          const newLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            ...activity
          };
          logs.push(newLog);
          localStorage.setItem('activity_logs', JSON.stringify(logs));
        };

        logActivity({
          action: 'update',
          entityType: 'user',
          entityId: user.id,
          entityName: user.name,
          details: 'Senha de usuário atualizada'
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      const existingUser = users.find(u => u.username === userData.username);
      
      if (existingUser) {
        throw new Error("Nome de usuário já está em uso");
      }
      
      const newUser: User = {
        id: uuidv4(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedUsers = [...users, newUser];
      
      localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
      
      setUsers(updatedUsers);
      
      if (user) {
        try {
          const logActivity = (activity: any) => {
            const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
            const newLog = {
              id: uuidv4(),
              timestamp: new Date().toISOString(),
              userId: user.id,
              userName: user.name,
              ...activity
            };
            logs.push(newLog);
            localStorage.setItem('activity_logs', JSON.stringify(logs));
          };

          logActivity({
            action: 'create',
            entityType: 'user',
            entityId: newUser.id,
            entityName: newUser.name,
            details: 'Novo usuário criado'
          });
        } catch (error) {
          console.error('Failed to log activity:', error);
        }
      }
      
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const deleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    
    if (!userToDelete) {
      throw new Error("Usuário não encontrado");
    }
    
    if (user && user.id === userId) {
      throw new Error("Você não pode excluir seu próprio usuário");
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    
    localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
    
    setUsers(updatedUsers);
    
    if (user) {
      try {
        const logActivity = (activity: any) => {
          const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
          const newLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            ...activity
          };
          logs.push(newLog);
          localStorage.setItem('activity_logs', JSON.stringify(logs));
        };

        logActivity({
          action: 'delete',
          entityType: 'user',
          entityId: userId,
          entityName: userToDelete.name,
          details: 'Usuário excluído'
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
    }
    
    return true;
  };

  const resetUserPassword = (userId: string, newPassword: string) => {
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }
    
    const updatedUser = {
      ...users[userIndex],
      // password would be stored here if we were implementing real auth
    };
    
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    
    localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
    
    setUsers(updatedUsers);
    
    if (user) {
      try {
        const logActivity = (activity: any) => {
          const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
          const newLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            ...activity
          };
          logs.push(newLog);
          localStorage.setItem('activity_logs', JSON.stringify(logs));
        };

        logActivity({
          action: 'update',
          entityType: 'user',
          entityId: userId,
          entityName: updatedUser.name,
          details: 'Senha redefinida'
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
    }
    
    return true;
  };

  const value = {
    user,
    users,
    currentUser: user,
    loading,
    login,
    logout,
    updateUserProfile,
    updateUser,
    createUser,
    deleteUser,
    resetUserPassword,
    updateUserPassword,
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
