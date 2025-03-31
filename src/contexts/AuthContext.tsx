import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserPermissions } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  updateUserPermissions: (userId: string, permissions: UserPermissions) => void;
  users: User[];
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
  const { toast } = useToast();
  
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
        toast({
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
      
      toast({
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
    toast({
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
    
    toast({
      title: "Permissões atualizadas",
      description: "As permissões do usuário foram atualizadas com sucesso.",
    });
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user,
      updateUserPermissions,
      users
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
