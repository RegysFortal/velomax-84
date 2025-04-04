
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  ClipboardList, 
  Home, 
  Package, 
  Settings, 
  Users, 
  MapPin, 
  Wallet, 
  Truck, 
  UserCheck, 
  Wrench, 
  BookOpenCheck,
  PackageOpen,
  ChartBar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface MainNavProps {
  className?: string;
  isMobile?: boolean;
}

export function MainNav({ className, isMobile = false }: MainNavProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canManageSystem = isAdmin || isManager;
  
  // Define routes categorized by section
  const operationalRoutes = [
    {
      href: "/deliveries",
      label: "Entregas",
      icon: Package,
      active: pathname.includes("/deliveries"),
      canAccess: user?.permissions?.deliveries ?? true // Default to true for backward compatibility
    },
    {
      href: "/shipments",
      label: "Embarques",
      icon: PackageOpen,
      active: pathname.includes("/shipments"),
      canAccess: user?.permissions?.shipments ?? true // Default to true for backward compatibility
    },
    {
      href: "/shipment-reports",
      label: "Relatórios de Embarques",
      icon: ChartBar,
      active: pathname.includes("/shipment-reports"),
      canAccess: user?.permissions?.reports // Only users with report permissions
    }
  ];

  const financialRoutes = [
    {
      href: "/financial",
      label: "Financeiro",
      icon: Wallet,
      active: pathname.includes("/financial"),
      canAccess: user?.permissions?.financial
    },
    {
      href: "/reports",
      label: "Relatórios",
      icon: BarChart3,
      active: pathname.includes("/reports"),
      canAccess: user?.permissions?.reports
    },
    {
      href: "/price-tables",
      label: "Tabelas de Preço",
      icon: ClipboardList,
      active: pathname.includes("/price-tables"),
      canAccess: user?.permissions?.priceTables
    },
    {
      href: "/cities",
      label: "Cidades",
      icon: MapPin,
      active: pathname.includes("/cities"),
      canAccess: user?.permissions?.cities
    }
  ];

  const managementRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
      canAccess: user?.permissions?.dashboard ?? true // Everyone should have access to dashboard by default
    },
    {
      href: "/logbook",
      label: "Diário de Bordo",
      icon: BookOpenCheck,
      active: pathname.includes("/logbook"),
      canAccess: user?.permissions?.logbook ?? canManageSystem // Only admins and managers can access logbook by default
    },
    {
      href: "/clients",
      label: "Clientes",
      icon: Users,
      active: pathname.includes("/clients"),
      canAccess: user?.permissions?.clients
    },
    {
      href: "/employees",
      label: "Funcionários",
      icon: UserCheck,
      active: pathname.includes("/employees"),
      canAccess: user?.permissions?.employees ?? canManageSystem
    },
    {
      href: "/vehicles",
      label: "Veículos",
      icon: Truck,
      active: pathname.includes("/vehicles"),
      canAccess: user?.permissions?.vehicles ?? canManageSystem
    },
    {
      href: "/maintenance",
      label: "Manutenções",
      icon: Wrench,
      active: pathname.includes("/maintenance"),
      canAccess: user?.permissions?.maintenance ?? canManageSystem
    },
    {
      href: "/settings",
      label: "Configurações",
      icon: Settings,
      active: pathname.includes("/settings"),
      canAccess: user?.permissions?.settings ?? isAdmin
    }
  ];

  // Filter routes based on user's role and access permissions
  const filterRoutes = (routes: any[]) => 
    routes.filter(route => route.canAccess === true);

  const accessibleOperationalRoutes = filterRoutes(operationalRoutes);
  const accessibleFinancialRoutes = filterRoutes(financialRoutes);
  const accessibleManagementRoutes = filterRoutes(managementRoutes);
  
  // For mobile, we'll render a flat list
  if (isMobile) {
    const allRoutes = [
      ...accessibleOperationalRoutes,
      ...accessibleFinancialRoutes,
      ...accessibleManagementRoutes
    ];
    
    return (
      <nav className={cn("flex flex-col", className)}>
        {allRoutes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex items-center px-2 py-2 text-base transition-colors hover:text-primary",
              route.active
                ? "font-medium text-primary"
                : "text-muted-foreground"
            )}
          >
            {route.icon && (
              <route.icon className="h-5 w-5 mr-2" />
            )}
            {route.label}
          </Link>
        ))}
      </nav>
    );
  }
  
  // For desktop, we'll use the NavigationMenu
  return (
    <NavigationMenu className={cn("flex", className)}>
      <NavigationMenuList className="flex gap-2">
        {accessibleOperationalRoutes.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(
              accessibleOperationalRoutes.some(route => route.active) && "text-primary bg-accent"
            )}>
              Operacional
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[200px] gap-1 p-2">
                {accessibleOperationalRoutes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground rounded-md",
                      route.active
                        ? "font-medium text-primary bg-accent/50"
                        : "text-muted-foreground"
                    )}
                  >
                    {route.icon && (
                      <route.icon className="h-4 w-4 mr-2" />
                    )}
                    {route.label}
                  </Link>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        {accessibleFinancialRoutes.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(
              accessibleFinancialRoutes.some(route => route.active) && "text-primary bg-accent"
            )}>
              Financeiro
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[200px] gap-1 p-2">
                {accessibleFinancialRoutes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground rounded-md",
                      route.active
                        ? "font-medium text-primary bg-accent/50"
                        : "text-muted-foreground"
                    )}
                  >
                    {route.icon && (
                      <route.icon className="h-4 w-4 mr-2" />
                    )}
                    {route.label}
                  </Link>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        {accessibleManagementRoutes.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(
              accessibleManagementRoutes.some(route => route.active) && "text-primary bg-accent"
            )}>
              Gerência
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[200px] gap-1 p-2">
                {accessibleManagementRoutes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground rounded-md",
                      route.active
                        ? "font-medium text-primary bg-accent/50"
                        : "text-muted-foreground"
                    )}
                  >
                    {route.icon && (
                      <route.icon className="h-4 w-4 mr-2" />
                    )}
                    {route.label}
                  </Link>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
