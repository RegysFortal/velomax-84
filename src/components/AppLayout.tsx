
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from './AppHeader';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
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
      };

      // Special case for activity logs (admin only)
      if (location.pathname === '/activity-logs' && user.role !== 'admin') {
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      // Check if current path needs permission
      const requiredPermission = pathPermissions[location.pathname];
      
      if (requiredPermission && !hasPermission(requiredPermission)) {
        // Admin can access everything
        if (user.role !== 'admin') {
          toast({
            title: "Acesso restrito",
            description: "Você não tem permissão para acessar esta página.",
            variant: "destructive",
          });
          
          // Redirect to dashboard or first accessible page
          if (hasPermission('dashboard')) {
            navigate('/dashboard');
          } else if (hasPermission('deliveries')) {
            navigate('/deliveries');
          } else if (hasPermission('financial')) {
            navigate('/financial');
          } else {
            navigate('/profile');
          }
        }
      }
    }
  }, [location.pathname, user, loading, hasPermission, navigate, toast]);
  
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
