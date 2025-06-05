
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useBackupPermissions() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkBackupPermissions = async () => {
      try {
        setIsLoading(true);
        
        if (user) {
          // First check by role for reliability
          if (user.role === 'admin' || user.role === 'manager') {
            setHasAccess(true);
            setIsLoading(false);
            return;
          }
          
          // Only check with Supabase RPC if needed
          const { data: accessAllowed, error } = await supabase.rpc('user_has_backup_access');
          
          if (error) {
            console.error("Error checking backup permissions:", error);
            setHasAccess(false);
          } else {
            setHasAccess(!!accessAllowed);
          }
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error checking backup access:", error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBackupPermissions();
  }, [user]);
  
  return { hasAccess, isLoading };
}
