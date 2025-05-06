
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { AppHeader } from './AppHeader';
import { toast } from 'sonner';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsPermissions, setSettingsPermissions] = useState<{[key: string]: boolean}>({
    system: false,
    company: false,
    users: false,
    backup: false,
    notifications: true // Default to true as most users can manage their own
  });
  
  useEffect(() => {
    if (!loading && !user) {
      console.log("No authenticated user, redirecting to login");
      navigate('/login');
      return;
    }
    
    // Fetch settings permissions if the user is authenticated
    if (user && !loading) {
      const fetchSettingsPermissions = async () => {
        try {
          const { data: systemAccess, error: systemError } = await supabase.rpc('user_has_system_settings_access');
          const { data: companyAccess, error: companyError } = await supabase.rpc('user_has_company_settings_access');
          const { data: userAccess, error: userError } = await supabase.rpc('user_has_user_management_access');
          const { data: backupAccess, error: backupError } = await supabase.rpc('user_has_backup_access');
          
          // If there are errors, fall back to client-side permission checks
          if (systemError || companyError || userError || backupError) {
            console.error("Error fetching settings permissions:", { systemError, companyError, userError, backupError });
            
            // Fall back to client-side permission checks
            setSettingsPermissions({
              system: user.role === 'admin',
              company: user.role === 'admin',
              users: user.role === 'admin',
              backup: user.role === 'admin' || user.role === 'manager',
              notifications: true // Most users can manage their own
            });
          } else {
            setSettingsPermissions({
              system: !!systemAccess,
              company: !!companyAccess,
              users: !!userAccess,
              backup: !!backupAccess,
              notifications: true // Most users can manage their own
            });
          }
        } catch (error) {
          console.error("Error checking settings permissions:", error);
          
          // Fall back to client-side permission checks
          setSettingsPermissions({
            system: user.role === 'admin',
            company: user.role === 'admin',
            users: user.role === 'admin',
            backup: user.role === 'admin' || user.role === 'manager',
            notifications: true
          });
        }
      };
      
      fetchSettingsPermissions();
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Only check permissions when user data is loaded
    if (user && !loading) {
      // Define permission rules for each path
      const pathPermissions: Record<string, string> = {
        '/deliveries': 'deliveries',
        '/shipments': 'shipments',
        '/shipment-reports': 'shipmentReports',
        '/financial': 'financial',
        '/reports': 'reports',
        '/price-tables': 'priceTables',
        '/cities': 'cities',
        '/dashboard': 'dashboard',
        '/logbook': 'logbook',
        '/clients': 'clients',
        '/employees': 'employees',
        '/vehicles': 'vehicles',
        '/maintenance': 'maintenance',
        '/settings': 'settings',
        '/budgets': 'budgets'  // Changed from 'financial' to 'budgets'
      };

      // Special case for activity logs (admin only)
      if (location.pathname === '/activity-logs' && user.role !== 'admin') {
        toast("Acesso restrito", {
          description: "Você não tem permissão para acessar esta página.",
        });
        navigate('/dashboard');
        return;
      }

      // Special case for settings (check detailed settings permissions)
      if (location.pathname === '/settings') {
        // If user has no permission to any settings section
        const hasAnySettingsPermission = Object.values(settingsPermissions).some(Boolean);
        
        if (!hasAnySettingsPermission) {
          toast("Acesso restrito", {
            description: "Você não tem permissão para acessar as configurações.",
          });
          navigate('/dashboard');
          return;
        }
      }

      // Profile is accessible to all authenticated users
      if (location.pathname === '/profile') {
        return;
      }

      // Check if current path needs permission
      const requiredPermission = pathPermissions[location.pathname];
      
      if (requiredPermission) {
        // Admin users bypass permission checks
        if (user.role === 'admin') {
          return;
        }
        
        // Check if user has required permission
        if (!hasPermission(requiredPermission)) {
          console.log(`User lacks permission: ${requiredPermission} for path: ${location.pathname}`);
          toast("Acesso restrito", {
            description: "Você não tem permissão para acessar esta página.",
          });
          
          // Redirect to dashboard or first accessible page
          if (hasPermission('dashboard')) {
            navigate('/dashboard');
          } else if (hasPermission('deliveries')) {
            navigate('/deliveries');
          } else {
            navigate('/profile');
          }
        }
      }
    }
  }, [location.pathname, user, loading, hasPermission, navigate, settingsPermissions]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <div className="container py-6 md:py-8 max-w-7xl">
          {children}
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          By Reginaldo Cavalcante {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
