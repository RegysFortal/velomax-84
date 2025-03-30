
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
};

// Mock users for demo
const MOCK_USERS = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
  { id: '2', username: 'manager', password: 'manager123', role: 'manager', name: 'Gerente' },
  { id: '3', username: 'user', password: 'user123', role: 'user', name: 'Usuário Padrão' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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
      
      const foundUser = MOCK_USERS.find(
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
        role: foundUser.role as 'admin' | 'manager' | 'user',
        name: foundUser.name
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
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user 
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
