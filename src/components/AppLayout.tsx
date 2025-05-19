
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { AppHeader } from './AppHeader';
import { toast } from 'sonner';
import { User, PermissionLevel } from '@/types';

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
    clients: false,
    employees: false,
    contractors: false
  });
  
  useEffect(() => {
    if (!loading && !user) {
      console.log("No authenticated user, redirecting to login");
      navigate('/login');
      return;
    }
    
    // Set permissions based on role
    if (user && !loading) {
      // Fall back to client-side permission checks
      setSettingsPermissions({
        system: user.role === 'admin',
        company: user.role === 'admin',
        users: user.role === 'admin',
        backup: user.role === 'admin' || user.role === 'manager',
        clients: user.role === 'admin' || user.role === 'manager',
        employees: user.role === 'admin' || user.role === 'manager',
        contractors: user.role === 'admin' || user.role === 'manager'
      });
      
      // If user has permissions object, use that to override role-based permissions
      if (user.permissions) {
        setSettingsPermissions(prev => ({
          ...prev,
          system: !!user.permissions?.system?.view || prev.system,
          company: !!user.permissions?.company?.view || prev.company,
          users: !!user.permissions?.users?.view || prev.users,
          backup: !!user.permissions?.backup?.view || prev.backup,
          clients: !!user.permissions?.clients?.view || prev.clients,
          employees: !!user.permissions?.employees?.view || prev.employees,
          contractors: !!user.permissions?.contractors?.view || prev.contractors
        }));
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Only check permissions when user data is loaded
    if (user && !loading) {
      // Define permission rules for each path
      const pathPermissions: Record<string, { path: string; level: keyof PermissionLevel }> = {
        '/deliveries': { path: 'deliveries', level: 'view' },
        '/shipments': { path: 'shipments', level: 'view' },
        '/shipment-reports': { path: 'shipmentReports', level: 'view' },
        '/financial': { path: 'financialDashboard', level: 'view' },  
        '/reports': { path: 'financialReports', level: 'view' },     
        '/price-tables': { path: 'priceTables', level: 'view' },
        '/cities': { path: 'cities', level: 'view' },
        '/dashboard': { path: 'dashboard', level: 'view' },
        '/logbook': { path: 'logbook', level: 'view' },
        '/clients': { path: 'clients', level: 'view' },
        '/employees': { path: 'employees', level: 'view' },
        '/contractors': { path: 'contractors', level: 'view' },
        '/vehicles': { path: 'vehicles', level: 'view' },
        '/maintenance': { path: 'maintenance', level: 'view' },
        '/settings': { path: 'settings', level: 'view' },
        '/budgets': { path: 'budgets', level: 'view' },
        '/financial-dashboard': { path: 'financialDashboard', level: 'view' },
        '/accounts/reports': { path: 'financialReports', level: 'view' },
        '/accounts/payable': { path: 'payableAccounts', level: 'view' },
        '/accounts/receivable': { path: 'receivableAccounts', level: 'view' },
        '/inventory/products': { path: 'products', level: 'view' },
        '/inventory/entries': { path: 'inventoryEntries', level: 'view' },
        '/inventory/exits': { path: 'inventoryExits', level: 'view' },
        '/inventory/dashboard': { path: 'inventoryDashboard', level: 'view' },
        '/activity-logs': { path: 'activity-logs', level: 'view' }
      };

      // Special case for activity logs (admin only)
      if (location.pathname === '/activity-logs' && user.role !== 'admin') {
        toast.error("Acesso restrito", {
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
          toast.error("Acesso restrito", {
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
      const permissionConfig = pathPermissions[location.pathname];
      
      if (permissionConfig) {
        // Admin users bypass permission checks
        if (user.role === 'admin') {
          return;
        }
        
        // Check if user has required permission
        if (!hasPermission(permissionConfig.path, permissionConfig.level)) {
          console.log(`Access denied: User lacks permission '${permissionConfig.path}' for path: ${location.pathname}`);
          toast.error("Acesso restrito", {
            description: "Você não tem permissão para acessar esta página.",
          });
          
          // Redirect to dashboard or first accessible page
          if (hasPermission('dashboard', 'view')) {
            navigate('/dashboard');
          } else if (hasPermission('deliveries', 'view')) {
            navigate('/deliveries');
          } else {
            navigate('/profile');
          }
          
          return;
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
