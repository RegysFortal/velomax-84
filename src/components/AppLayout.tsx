
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
      if (user.role === 'admin') {
        setSettingsPermissions({
          system: true,
          company: true,
          users: true,
          backup: true,
          clients: true,
          employees: true,
          contractors: true
        });
      } else if (user.role === 'manager') {
        setSettingsPermissions({
          system: false,
          company: false,
          users: false,
          backup: true,
          clients: true,
          employees: true,
          contractors: true
        });
      } else {
        // Regular user permissions
        setSettingsPermissions({
          system: false,
          company: false,
          users: false,
          backup: false,
          clients: true,
          employees: true,
          contractors: true
        });
      }
      
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
      const pathPermissions: Record<string, { 
        path: string; 
        level: keyof PermissionLevel; 
        roleRestrictions?: string[];
        allowRegularUser?: boolean;
      }> = {
        '/deliveries': { path: 'deliveries', level: 'view', allowRegularUser: true },
        '/shipments': { path: 'shipments', level: 'view', allowRegularUser: true },
        '/shipment-reports': { path: 'shipmentReports', level: 'view', allowRegularUser: true },
        '/financial': { 
          path: 'financialDashboard', 
          level: 'view',
          roleRestrictions: ['admin', 'manager'] 
        },  
        '/reports': { 
          path: 'financialReports', 
          level: 'view',
          roleRestrictions: ['admin', 'manager']
        },     
        '/price-tables': { 
          path: 'priceTables', 
          level: 'view',
          roleRestrictions: ['admin', 'manager']
        },
        '/cities': { 
          path: 'cities', 
          level: 'view',
          allowRegularUser: true // Regular users can view cities
        },
        '/dashboard': { path: 'dashboard', level: 'view', allowRegularUser: true },
        '/logbook': { path: 'logbook', level: 'view', allowRegularUser: true },
        '/clients': { path: 'clients', level: 'view', allowRegularUser: true },
        '/employees': { path: 'employees', level: 'view', allowRegularUser: true },
        '/contractors': { path: 'contractors', level: 'view', allowRegularUser: true },
        '/vehicles': { path: 'vehicles', level: 'view', allowRegularUser: true },
        '/maintenance': { path: 'maintenance', level: 'view', allowRegularUser: true },
        '/settings': { path: 'settings', level: 'view' },
        '/budgets': { path: 'budgets', level: 'view', allowRegularUser: true },
        '/financial-dashboard': { 
          path: 'financialDashboard', 
          level: 'view',
          roleRestrictions: ['admin', 'manager']
        },
        '/accounts/reports': { 
          path: 'financialReports', 
          level: 'view',
          roleRestrictions: ['admin', 'manager']
        },
        '/accounts/payable': { 
          path: 'payableAccounts', 
          level: 'view',
          roleRestrictions: ['admin', 'manager']
        },
        '/accounts/receivable': { 
          path: 'receivableAccounts', 
          level: 'view',
          roleRestrictions: ['admin', 'manager']
        },
        '/inventory/products': { path: 'products', level: 'view', allowRegularUser: true },
        '/inventory/entries': { path: 'inventoryEntries', level: 'view', allowRegularUser: true },
        '/inventory/exits': { path: 'inventoryExits', level: 'view', allowRegularUser: true },
        '/inventory/dashboard': { path: 'inventoryDashboard', level: 'view', allowRegularUser: true },
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
        
        // Check role restrictions first
        if (permissionConfig.roleRestrictions && 
            !permissionConfig.roleRestrictions.includes(user.role || '')) {
          console.log(`Access denied: User role ${user.role} not in allowed roles for path: ${location.pathname}`);
          toast.error("Acesso restrito", {
            description: "Você não tem permissão para acessar esta página.",
          });
          
          navigate('/dashboard');
          return;
        }

        // For regular users, check if the path is explicitly allowed
        if (user.role === 'user' && !permissionConfig.allowRegularUser) {
          console.log(`Access denied: Regular users cannot access path: ${location.pathname}`);
          toast.error("Acesso restrito", {
            description: "Você não tem permissão para acessar esta página.",
          });
          
          navigate('/dashboard');
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
