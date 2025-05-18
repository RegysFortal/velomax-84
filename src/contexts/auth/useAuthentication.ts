
import { useState, useCallback } from 'react';
import { User, PermissionLevel } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthentication = (
  initialUsers: User[],
  updateUsers: (users: User[]) => void
) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('velomax_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.includes('@') ? username : `${username}@velomax.com.br`,
        password,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login', {
        description: error.message || 'Credenciais inválidas. Verifique seu nome de usuário e senha.'
      });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentUser(null);
      localStorage.removeItem('velomax_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUserProfile = useCallback(async (userData: Partial<User>) => {
    if (!user) return false;

    try {
      const updatedUser = { ...user, ...userData };
      
      // Atualizar usuário no Supabase
      // Implementar quando integrado com Supabase
      
      // Manter o estado local atualizado
      setUser(updatedUser);
      localStorage.setItem('velomax_user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }, [user]);

  const updateUserPassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return false;

    try {
      // Validar senha atual primeiro (simulação)
      // Em uma implementação real, isso seria verificado no servidor
      
      // Atualizar senha no Supabase
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast.success("Senha atualizada", {
        description: "Sua senha foi atualizada com sucesso."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error("Erro ao atualizar senha", {
        description: error.message || "Não foi possível atualizar a senha. Verifique seus dados e tente novamente."
      });
      return false;
    }
  }, [user]);

  // Improved permission checking function with detailed logging for debugging
  const hasPermission = useCallback((feature: string, level: keyof PermissionLevel = 'view'): boolean => {
    if (!user) {
      console.log(`Permission check failed: No user logged in, feature: ${feature}, level: ${level}`);
      return false;
    }
    
    // Administradores têm acesso total a tudo
    if (user.role === 'admin') {
      console.log(`Permission granted: User is admin, feature: ${feature}, level: ${level}`);
      return true;
    }
    
    // Verifica no novo formato de permissões detalhadas
    if (user.permissions && user.permissions[feature]) {
      // Se for um objeto de permissão com níveis
      if (typeof user.permissions[feature] === 'object' && 
          user.permissions[feature] !== null) {
        const permissionObj = user.permissions[feature] as PermissionLevel;
        const hasAccess = !!permissionObj[level];
        console.log(`Permission check: User ${user.username}, feature: ${feature}, level: ${level}, result: ${hasAccess}, value: ${JSON.stringify(permissionObj)}`);
        return hasAccess;
      }
      
      // Suporte à retrocompatibilidade - se for booleano, considera apenas para view
      if (typeof user.permissions[feature] === 'boolean') {
        const hasAccess = level === 'view' ? !!user.permissions[feature] : false;
        console.log(`Permission check (legacy): User ${user.username}, feature: ${feature}, level: ${level}, result: ${hasAccess}`);
        return hasAccess;
      }
    }
    
    console.log(`Permission denied: User ${user.username}, feature: ${feature}, level: ${level}`);
    return false;
  }, [user]);

  return {
    user,
    currentUser,
    loading,
    login,
    logout,
    updateUserProfile,
    updateUserPassword,
    hasPermission,
    setUser,
    setLoading,
    setSupabaseUser,
    setSession,
    supabaseUser,
    session
  };
};
