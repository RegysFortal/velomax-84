import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
  hasPermission: (feature: keyof User['permissions']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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
            setUsers(usersList);
          } else {
            const updatedUsers = usersList.map((u: User) => 
              u.id === localUser.id 
                ? { ...u, lastLogin: new Date().toISOString() } 
                : u
            );
            localStorage.setItem('velomax_users', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
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
        console.error('Failed to load auth state', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('velomax_users', JSON.stringify(users));
    }
  }, [users, loading]);

  const login = async (username: string, password: string) => {
    try {
      if (username === 'admin') {
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
            details: 'Usuário fez login no sistema (modo demo)'
          });
        } catch (error) {
          console.error('Failed to log activity:', error);
        }

        toast({
          title: "Login bem-sucedido (modo demo)",
          description: `Bem-vindo, ${foundUser.name}!`,
        });
        
        navigate('/dashboard');
        return true;
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha incorretos",
          variant: "destructive",
        });
        return false;
      }
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

  const logout = async () => {
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

    await supabase.auth.signOut();
    
    setUser(null);
    setSupabaseUser(null);
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
      
      if (userData.permissions) {
        userData.permissions = {
          deliveries: userData.permissions.deliveries ?? users[userIndex].permissions.deliveries,
          shipments: userData.permissions.shipments ?? users[userIndex].permissions.shipments,
          clients: userData.permissions.clients ?? users[userIndex].permissions.clients,
          cities: userData.permissions.cities ?? users[userIndex].permissions.cities,
          reports: userData.permissions.reports ?? users[userIndex].permissions.reports,
          financial: userData.permissions.financial ?? users[userIndex].permissions.financial,
          priceTables: userData.permissions.priceTables ?? users[userIndex].permissions.priceTables,
          dashboard: userData.permissions.dashboard ?? users[userIndex].permissions.dashboard,
          logbook: userData.permissions.logbook ?? users[userIndex].permissions.logbook,
          employees: userData.permissions.employees ?? users[userIndex].permissions.employees,
          vehicles: userData.permissions.vehicles ?? users[userIndex].permissions.vehicles,
          maintenance: userData.permissions.maintenance ?? users[userIndex].permissions.maintenance,
          settings: userData.permissions.settings ?? users[userIndex].permissions.settings,
        };
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
      
      const permissions = {
        deliveries: userData.permissions?.deliveries ?? false,
        shipments: userData.permissions?.shipments ?? false,
        clients: userData.permissions?.clients ?? false,
        cities: userData.permissions?.cities ?? false,
        reports: userData.permissions?.reports ?? false,
        financial: userData.permissions?.financial ?? false,
        priceTables: userData.permissions?.priceTables ?? false,
        dashboard: userData.permissions?.dashboard ?? true,
        logbook: userData.permissions?.logbook ?? false,
        employees: userData.permissions?.employees ?? false,
        vehicles: userData.permissions?.vehicles ?? false,
        maintenance: userData.permissions?.maintenance ?? false,
        settings: userData.permissions?.settings ?? false,
      };
      
      const newUser: User = {
        id: uuidv4(),
        ...userData,
        permissions,
        createdAt: new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
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

  const hasPermission = (feature: keyof User['permissions']) => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    return user.permissions && user.permissions[feature] === true;
  };

  const value = {
    user,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
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
