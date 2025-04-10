
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
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
        <ScrollArea className={`h-[300px] ${isMobile ? "w-[250px]" : "w-[400px]"}`}>
          <div className="grid gap-3 p-4">
            <Link
              to="/dashboard"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/dashboard")
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/logbook"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/logbook")
              )}
            >
              Diário de Bordo
            </Link>
            <Link
              to="/clients"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/clients")
              )}
            >
              Clientes
            </Link>
            <Link
              to="/employees"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/employees")
              )}
            >
              Funcionários
            </Link>
            <Link
              to="/vehicles"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/vehicles")
              )}
            >
              Veículos
            </Link>
            <Link
              to="/maintenance"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/maintenance")
              )}
            >
              Manutenções
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/activity-logs"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/activity-logs")
                )}
              >
                Logs de Atividades
              </Link>
            )}
            <Link
              to="/settings"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/settings")
              )}
            >
              Configurações do Sistema
            </Link>
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
