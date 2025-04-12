
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings, BarChart2, BookOpen, Users, Truck, Tool, FileText } from "lucide-react";
import { User } from "@/types";
import { 
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActiveClass, hasManagementAccess } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManagementMenuProps {
  user: User | null;
  hasPermission: (permission: string) => boolean;
}

export const ManagementMenu: React.FC<ManagementMenuProps> = ({ user, hasPermission }) => {
  const location = useLocation();
  const { isMobile } = useIsMobile();
  
  if (!hasManagementAccess(user, hasPermission)) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger className={isMobile ? "w-full justify-start" : ""}>
        <Settings className="mr-2 h-4 w-4" />
        Gerência
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ScrollArea className={`${isMobile ? "h-[200px] w-full" : "h-[300px] w-[400px]"}`}>
          <div className="grid gap-3 p-4">
            {hasPermission('dashboard') && (
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/dashboard")
                )}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            )}
            {hasPermission('logbook') && (
              <Link
                to="/logbook"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/logbook")
                )}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Diário de Bordo
              </Link>
            )}
            {hasPermission('clients') && (
              <Link
                to="/clients"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/clients")
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                Clientes
              </Link>
            )}
            {hasPermission('employees') && (
              <Link
                to="/employees"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/employees")
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                Funcionários
              </Link>
            )}
            {hasPermission('vehicles') && (
              <Link
                to="/vehicles"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/vehicles")
                )}
              >
                <Truck className="mr-2 h-4 w-4" />
                Veículos
              </Link>
            )}
            {hasPermission('maintenance') && (
              <Link
                to="/maintenance"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/maintenance")
                )}
              >
                <Tool className="mr-2 h-4 w-4" />
                Manutenções
              </Link>
            )}
            {(user?.role === 'admin' || hasPermission('settings')) && (
              <Link
                to="/settings"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/settings")
                )}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/activity-logs"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/activity-logs")
                )}
              >
                <FileText className="mr-2 h-4 w-4" />
                Logs de Atividades
              </Link>
            )}
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
