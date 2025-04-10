
import { useState, useCallback } from 'react';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { logUserActivity } from './authUtils';

export const useAuthentication = (users: User[], setUsers: (users: User[]) => void) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use try-catch with useNavigate to handle the case where it's not inside a Router
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    // Create a dummy navigate function for initial render
    navigate = (path: string) => {
      console.warn('Navigation attempted outside Router context:', path);
      return false;
    };
  }
  
  const { toast } = useToast();

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

        logUserActivity(
          foundUser,
          'login',
          'user',
          foundUser.id,
          foundUser.name,
          'Usuário fez login no sistema (modo demo)'
        );

        toast({
          title: "Login bem-sucedido (modo demo)",
          description: `Bem-vindo, ${foundUser.name}!`,
        });
        
        navigate('/dashboard');
        return true;
      } else {
        const email = username.includes('@') ? username : `${username}@velomax.com`;
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast({
            title: "Login bem-sucedido",
            description: `Bem-vindo, ${data.user.email}!`,
          });
          navigate('/dashboard');
          return true;
        }
        
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
      logUserActivity(
        user,
        'logout',
        'user',
        '',
        '',
        'Usuário fez logout do sistema'
      );
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
      
      setUser(updatedUser);
      localStorage.setItem('velomax_user', JSON.stringify(updatedUser));
      
      logUserActivity(
        user,
        'update',
        'user',
        user.id,
        updatedUser.name,
        'Perfil de usu��rio atualizado'
      );
      
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
      
      logUserActivity(
        user,
        'update',
        'user',
        user.id,
        user.name,
        'Senha de usuário atualizada'
      );
      
      return true;
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  };

  const hasPermission = (feature: keyof User['permissions']) => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    return user.permissions && user.permissions[feature] === true;
  };

  return {
    user,
    currentUser: user,
    loading,
    login,
    logout,
    updateUserProfile,
    updateUserPassword,
    hasPermission,
    setUser,
    setSupabaseUser,
    setSession,
    setLoading,
    supabaseUser,
    session
  };
};
