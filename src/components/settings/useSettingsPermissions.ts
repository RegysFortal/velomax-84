
import { useState, useEffect } from 'react';
import { User } from '@/types';

export interface SettingsPermissions {
  system: boolean;
  company: boolean;
  backup: boolean;
  clients: boolean;
  employees: boolean;
  contractors: boolean;
}

export function useSettingsPermissions(user: User | null) {
  const [permissions, setPermissions] = useState<SettingsPermissions>({
    system: false,
    company: false,
    backup: false,
    clients: false,
    employees: false,
    contractors: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setPermissions({
            system: false,
            company: false,
            backup: false,
            clients: false,
            employees: false,
            contractors: false,
          });
          return;
        }

        // Set permissions based on user role
        const isAdmin = user.role === 'admin';
        const isManager = user.role === 'manager' || isAdmin;

        setPermissions({
          system: isAdmin,
          company: isAdmin,
          backup: isManager,
          clients: isManager,
          employees: isManager,
          contractors: isManager,
        });

      } catch (error) {
        console.error('Error checking settings permissions:', error);
        setError('Erro ao verificar permissões');
        // Fallback to role-based permissions
        const isAdmin = user?.role === 'admin';
        const isManager = user?.role === 'manager' || isAdmin;

        setPermissions({
          system: isAdmin,
          company: isAdmin,
          backup: isManager,
          clients: isManager,
          employees: isManager,
          contractors: isManager,
        });
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [user]);

  return { permissions, loading, error, setError, setPermissions };
}
