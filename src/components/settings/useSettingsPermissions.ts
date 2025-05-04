import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from 'sonner';

interface SettingsPermissions {
  system: boolean;
  company: boolean;
  users: boolean;
  backup: boolean;
  notifications: boolean;
}

export const useSettingsPermissions = (user: User | null) => {
  const [permissions, setPermissions] = useState<SettingsPermissions>({
    system: false,
    company: false,
    users: false,
    backup: false,
    notifications: true // Default to true as all users can manage their own notifications
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fallback to role-based permissions first for reliability
        if (user.role === 'admin') {
          setPermissions({
            system: true,
            company: true,
            users: true,
            backup: true,
            notifications: true
          });
          setLoading(false);
          return;
        } else if (user.role === 'manager') {
          setPermissions({
            system: false,
            company: false,
            users: false,
            backup: true,
            notifications: true
          });
          setLoading(false);
          return;
        }
        
        // Only try Supabase RPC if role check didn't set full permissions
        const permissionPromises = [
          supabase.rpc('user_has_system_settings_access').then(({ data, error }) => {
            if (error) throw new Error(`System settings access check failed: ${error.message}`);
            return { key: 'system', value: !!data };
          }),
          supabase.rpc('user_has_company_settings_access').then(({ data, error }) => {
            if (error) throw new Error(`Company settings access check failed: ${error.message}`);
            return { key: 'company', value: !!data };
          }),
          supabase.rpc('user_has_user_management_access').then(({ data, error }) => {
            if (error) throw new Error(`User management access check failed: ${error.message}`);
            return { key: 'users', value: !!data };
          }),
          supabase.rpc('user_has_backup_access').then(({ data, error }) => {
            if (error) throw new Error(`Backup access check failed: ${error.message}`);
            return { key: 'backup', value: !!data };
          }),
          // Notifications are assumed to be available to all users
          Promise.resolve({ key: 'notifications', value: true })
        ];

        const results = await Promise.allSettled(permissionPromises);
        
        const newPermissions = { ...permissions };
        let hasErrors = false;
        
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            const { key, value } = result.value;
            newPermissions[key as keyof typeof permissions] = value;
          } else {
            console.error("Permission check failed:", result.reason);
            hasErrors = true;
          }
        });
        
        if (hasErrors) {
          setError("Alguns serviços de permissão não estão disponíveis. Usando permissões baseadas em função.");
        }
        
        setPermissions(newPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setError("Erro ao carregar permissões. Usando configurações padrão.");
        
        // Keep notifications available by default
        setPermissions(prev => ({
          ...prev,
          notifications: true
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  return { permissions, loading, error, setError };
};
