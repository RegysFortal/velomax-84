
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, ClipboardList, Home, Package, Settings, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  
  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/clients",
      label: "Clientes",
      icon: Users,
      active: pathname.includes("/clients"),
      canAccess: canManageSystem
    },
    {
      href: "/deliveries",
      label: "Entregas",
      icon: Package,
      active: pathname.includes("/deliveries"),
    },
    {
      href: "/reports",
      label: "Relatórios",
      icon: BarChart3,
      active: pathname.includes("/reports"),
    },
    {
      href: "/price-tables",
      label: "Tabelas de Preço",
      icon: ClipboardList,
      active: pathname.includes("/price-tables"),
      canAccess: canManageSystem
    },
    {
      href: "/settings",
      label: "Configurações",
      icon: Settings,
      active: pathname.includes("/settings"),
      canAccess: isAdmin
    },
  ];

  // Filter routes based on user's role and access permissions
  const accessibleRoutes = routes.filter(
    route => route.canAccess === undefined || route.canAccess
  );
  
  return (
    <nav className={cn("flex", className)}>
      {accessibleRoutes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            "flex items-center px-2 py-1.5 text-sm transition-colors hover:text-primary",
            route.active
              ? "font-medium text-primary"
              : "text-muted-foreground",
            isMobile && "justify-start text-base py-2"
          )}
        >
          {route.icon && (
            <route.icon className={cn("h-4 w-4 mr-2", isMobile && "h-5 w-5")} />
          )}
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
