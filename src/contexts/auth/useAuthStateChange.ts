
import { useEffect } from 'react';
import { User, PermissionLevel } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthStateChangeProps {
  setUser: (user: User | null) => void;
  setSupabaseUser: (user: any) => void;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStateChange = ({ 
  setUser, 
  setSupabaseUser, 
  setSession, 
  setLoading 
}: UseAuthStateChangeProps) => {
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          
          try {
            // Fetch user information from the database
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (userError && userError.code !== 'PGRST116') {
              console.error("Error fetching user data:", userError);
            }
            
            // Fetch user permissions
            const { data: permissionsData, error: permissionsError } = await supabase
              .from('user_permissions')
              .select('*')
              .eq('user_id', session.user.id);
            
            if (permissionsError) {
              console.error("Error fetching user permissions:", permissionsError);
            }
            
            // Fetch user role
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (roleError && roleError.code !== 'PGRST116') {
              console.error("Error fetching user role:", roleError);
            }
            
            // Build permissions object
            const permissionsObj: Record<string, PermissionLevel> = {};
            if (permissionsData && permissionsData.length > 0) {
              permissionsData.forEach((perm: any) => {
                permissionsObj[perm.resource] = {
                  view: perm.view || false,
                  create: perm.create || false,
                  edit: perm.edit || false,
                  delete: perm.delete || false
                };
              });
            }
            
            // Fix type error: Cast the role string to the appropriate type
            const userRole = roleData?.role as 'user' | 'admin' | 'manager' | 'driver' | 'helper' || 'user';
            
            // Build complete user object
            const localUser: User = {
              id: session.user.id,
              name: userData?.name || session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
              username: userData?.username || session.user.email?.split('@')[0] || session.user.id,
              email: userData?.email || session.user.email || `${session.user.id}@velomax.com`,
              role: userRole,
              department: userData?.department,
              position: userData?.position,
              phone: userData?.phone,
              createdAt: userData?.created_at || new Date().toISOString(),
              updatedAt: userData?.updated_at || new Date().toISOString(),
              permissions: permissionsObj
            };
            
            // Update user state
            console.log("Authenticated user with complete data:", localUser);
            setUser(localUser);
            localStorage.setItem('velomax_user', JSON.stringify(localUser));
            
            // Update local user list
            const storedUsers = localStorage.getItem('velomax_users');
            let usersList = storedUsers ? JSON.parse(storedUsers) : [];
            
            const existingUserIndex = usersList.findIndex((u: User) => u.id === localUser.id);
            if (existingUserIndex >= 0) {
              usersList[existingUserIndex] = { ...localUser };
            } else {
              usersList.push(localUser);
            }
            
            localStorage.setItem('velomax_users', JSON.stringify(usersList));
            
          } catch (error) {
            console.error("Error processing authentication data:", error);
          }
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
        setLoading(false);
      } catch (error) {
        console.error('Failed to load auth state', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSupabaseUser, setSession, setLoading]);
};
