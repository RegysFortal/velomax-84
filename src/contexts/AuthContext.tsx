import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserPermissions } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  updateUserPermissions: (userId: string, permissions: UserPermissions) => void;
  users: User[];
  updateUserProfile: (userId: string, userData: Partial<User>) => Promise<void>;
  updateUserPassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
  createUser: (userData: Omit<User, 'id'>) => Promise<User>;
  deleteUser: (userId: string) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
};

// Mock users for demo with default permissions
const DEFAULT_PERMISSIONS: UserPermissions = {
  clients: true,
  cities: true,
  reports: true,
  financial: true,
  priceTables: true,
  settings: false
};

const MOCK_USERS: User[] = [
  { 
    id: '1', 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin', 
    name: 'Administrador',
    permissions: {
      ...DEFAULT_PERMISSIONS,
      settings: true
    }
  },
  { 
    id: '2', 
    username: 'manager', 
    password: 'manager123', 
    role: 'manager', 
    name: 'Gerente',
    permissions: {
      ...DEFAULT_PERMISSIONS,
      settings: false
    }
  },
  { 
    id: '3', 
    username: 'user', 
    password: 'user123', 
    role: 'user', 
    name: 'Usuário Padrão',
    permissions: {
      clients: false,
      cities: false,
      reports: true,
      financial: false,
      priceTables: false,
      settings: false
    }
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading, setLoading] = useState(true);
  const { toast: uiToast } = useToast();
  
  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('velomax_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('velomax_user');
      }
    }
    setLoading(false);
  }, []);

  // Store users in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('velomax_users', JSON.stringify(users.map(u => ({
        ...u,
        // Don't store passwords in clear text
        password: u.password ? '[PROTECTED]' : undefined
      }))));
    } catch (error) {
      console.error('Failed to store users', error);
    }
  }, [users]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    
    // In a real app, this would be an API call
    try {
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = users.find(
        u => u.username === username && u.password === password
      );
      
      if (!foundUser) {
        uiToast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha incorretos.",
          variant: "destructive"
        });
        throw new Error('Invalid credentials');
      }
      
      // Create sanitized user object (without password)
      const authenticatedUser: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name,
        permissions: foundUser.permissions
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('velomax_user', JSON.stringify(authenticatedUser));
      
      uiToast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${authenticatedUser.name}!`,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('velomax_user');
    uiToast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema.",
    });
  };

  const updateUserPermissions = (userId: string, permissions: UserPermissions) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, permissions } : u
    );
    
    setUsers(updatedUsers);
    
    // If the current user's permissions are being updated, update the current user state
    if (user && user.id === userId) {
      const updatedUser = { ...user, permissions };
      setUser(updatedUser);
      localStorage.setItem('velomax_user', JSON.stringify(updatedUser));
    }
    
    uiToast({
      title: "Permissões atualizadas",
      description: "As permissões do usuário foram atualizadas com sucesso.",
    });
  };

  const updateUserProfile = async (userId: string, userData: Partial<User>) => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Simulating network delay
        setTimeout(() => {
          const updatedUsers = users.map(u => 
            u.id === userId ? { ...u, ...userData } : u
          );
          
          setUsers(updatedUsers);
          
          // If the current user's profile is being updated, update the current user state
          if (user && user.id === userId) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('velomax_user', JSON.stringify(updatedUser));
          }
          
          resolve();
        }, 800);
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Find user
        const userToUpdate = users.find(u => u.id === userId);
        
        if (!userToUpdate) {
          reject(new Error('Usuário não encontrado'));
          return;
        }
        
        // Verify current password
        if (userToUpdate.password !== currentPassword) {
          reject(new Error('Senha atual incorreta'));
          return;
        }
        
        // Simulating network delay
        setTimeout(() => {
          const updatedUsers = users.map(u => 
            u.id === userId ? { ...u, password: newPassword } : u
          );
          
          setUsers(updatedUsers);
          resolve();
        }, 800);
      } catch (error) {
        reject(error);
      }
    });
  };

  const createUser = async (userData: Omit<User, 'id'>) => {
    return new Promise<User>((resolve, reject) => {
      try {
        // Check if username already exists
        if (users.some(u => u.username === userData.username)) {
          reject(new Error('Nome de usuário já existe'));
          return;
        }
        
        // Generate a new user ID
        const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
        
        // Create new user
        const newUser: User = {
          id: newId,
          ...userData
        };
        
        // Simulating network delay
        setTimeout(() => {
          setUsers(prev => [...prev, newUser]);
          toast.success("Usuário criado com sucesso");
          resolve(newUser);
        }, 800);
      } catch (error) {
        reject(error);
      }
    });
  };

  const deleteUser = (userId: string) => {
    // Prevent deletion of the last admin
    const admins = users.filter(u => u.role === 'admin');
    if (admins.length === 1 && admins[0].id === userId) {
      uiToast({
        title: "Operação não permitida",
        description: "Não é possível excluir o último administrador do sistema.",
        variant: "destructive"
      });
      return;
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    toast.success("Usuário excluído com sucesso");
  };

  const resetUserPassword = (userId: string, newPassword: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, password: newPassword } : u
    );
    
    setUsers(updatedUsers);
    toast.success("Senha do usuário redefinida com sucesso");
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user,
      updateUserPermissions,
      users,
      updateUserProfile,
      updateUserPassword,
      createUser,
      deleteUser,
      resetUserPassword
    }}>
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
