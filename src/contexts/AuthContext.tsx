import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
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

        // Log activity
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

        navigate('/dashboard');
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    if (user) {
      try {
        // Log activity
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
      
      // Find the user to update
      const userIndex = users.findIndex(u => u.id === user.id);
      
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
      setUser(updatedUser);
      localStorage.setItem('velomax_user', JSON.stringify(updatedUser));
      
      // Log activity
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

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Simplified password check for demo
      if (currentPassword !== 'password') {
        throw new Error("Senha atual incorreta");
      }
      
      // Find the user to update
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("Usuário não encontrado");
      }
      
      // In a real app, you'd hash the password here
      // For this demo, we'll just pretend we update the password
      
      // Log activity
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
    // Find the user to update
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }
    
    // Create updated user (in a real app, you'd hash the password)
    const updatedUser = {
      ...users[userIndex],
      // password would be stored here if we were implementing real auth
    };
    
    // Update users array
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    
    // Update localStorage
    localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
    
    // Update state
    setUsers(updatedUsers);
    
    // Log activity
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
    loading,
    login,
    logout,
    updateUserProfile,
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
