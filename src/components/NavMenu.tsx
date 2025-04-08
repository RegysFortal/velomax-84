
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Truck, Calculator, Settings } from "lucide-react";

export function NavMenu() {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  const getActiveClass = (path: string) => {
    return location.pathname === path
      ? "text-primary"
      : "text-muted-foreground";
  };

  // Check if user has access to any operational modules
  const hasOperationalAccess = 
    hasPermission('deliveries') || 
    hasPermission('shipments');

  // Check if user has access to any financial modules
  const hasFinancialAccess = 
    hasPermission('financial') || 
    hasPermission('reports') || 
    hasPermission('priceTables') || 
    hasPermission('cities');

  // Check if user has access to any management modules
  const hasManagementAccess = 
    hasPermission('dashboard') || 
    hasPermission('logbook') || 
    hasPermission('clients') || 
    hasPermission('employees') || 
    hasPermission('vehicles') || 
    hasPermission('maintenance') || 
    user?.role === 'admin';

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Menu Operacional - Only show if user has access */}
        {hasOperationalAccess && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Truck className="mr-2 h-4 w-4" />
              Operacional
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                {hasPermission('deliveries') && (
                  <Link
                    to="/deliveries"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/deliveries")
                    )}
                  >
                    Entregas
                  </Link>
                )}
                {hasPermission('shipments') && (
                  <Link
                    to="/shipments"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/shipments")
                    )}
                  >
                    Embarques
                  </Link>
                )}
                {hasPermission('reports') && (
                  <Link
                    to="/shipment-reports"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/shipment-reports")
                    )}
                  >
                    Relatórios de Embarques
                  </Link>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        {/* Menu Financeiro - Only show if user has access */}
        {hasFinancialAccess && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Calculator className="mr-2 h-4 w-4" />
              Financeiro
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                {hasPermission('financial') && (
                  <Link
                    to="/financial"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/financial")
                    )}
                  >
                    Financeiro
                  </Link>
                )}
                {hasPermission('reports') && (
                  <Link
                    to="/reports"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/reports")
                    )}
                  >
                    Relatórios
                  </Link>
                )}
                {hasPermission('priceTables') && (
                  <Link
                    to="/price-tables"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/price-tables")
                    )}
                  >
                    Tabelas de Preços
                  </Link>
                )}
                {hasPermission('cities') && (
                  <Link
                    to="/cities"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/cities")
                    )}
                  >
                    Cidades
                  </Link>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        {/* Menu Gerência - Only show if user has access */}
        {hasManagementAccess && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Settings className="mr-2 h-4 w-4" />
              Gerência
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                {hasPermission('dashboard') && (
                  <Link
                    to="/dashboard"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/dashboard")
                    )}
                  >
                    Dashboard
                  </Link>
                )}
                {hasPermission('logbook') && (
                  <Link
                    to="/logbook"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/logbook")
                    )}
                  >
                    Diário de Bordo
                  </Link>
                )}
                {hasPermission('clients') && (
                  <Link
                    to="/clients"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/clients")
                    )}
                  >
                    Clientes
                  </Link>
                )}
                {hasPermission('employees') && (
                  <Link
                    to="/employees"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/employees")
                    )}
                  >
                    Funcionários
                  </Link>
                )}
                {hasPermission('vehicles') && (
                  <Link
                    to="/vehicles"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/vehicles")
                    )}
                  >
                    Veículos
                  </Link>
                )}
                {hasPermission('maintenance') && (
                  <Link
                    to="/maintenance"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/maintenance")
                    )}
                  >
                    Manutenções
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/activity-logs"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/activity-logs")
                    )}
                  >
                    Logs de Atividades
                  </Link>
                )}
                {hasPermission('settings') && (
                  <Link
                    to="/settings"
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-accent",
                      getActiveClass("/settings")
                    )}
                  >
                    Configurações do Sistema
                  </Link>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
