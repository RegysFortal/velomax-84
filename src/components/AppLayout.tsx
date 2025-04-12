
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { AppHeader } from './AppHeader';
import { toast } from 'sonner';
import { User } from '@/types';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !user) {
      console.log("No authenticated user, redirecting to login");
      navigate('/login');
      return;
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Only check permissions when user data is loaded
    if (user && !loading) {
      // Define permission rules for each path
      const pathPermissions: Record<string, keyof User['permissions']> = {
        '/deliveries': 'deliveries',
        '/shipments': 'shipments',
        '/shipment-reports': 'reports',
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
        '/budgets': 'financial'
      };

      // Special case for activity logs (admin only)
      if (location.pathname === '/activity-logs' && user.role !== 'admin') {
        toast("Acesso restrito", {
          description: "Você não tem permissão para acessar esta página.",
        });
        navigate('/dashboard');
        return;
      }

      // Special case for settings (admin or has settings permission)
      if (location.pathname === '/settings' && user.role !== 'admin' && !hasPermission('settings')) {
        toast("Acesso restrito", {
          description: "Você não tem permissão para acessar esta página de configurações.",
        });
        navigate('/dashboard');
        return;
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
  }, [location.pathname, user, loading, hasPermission, navigate]);
  
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
