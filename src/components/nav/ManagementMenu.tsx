
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, Building2, Settings, User } from "lucide-react";
import { User as UserType } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActiveClass } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManagementMenuProps {
  user: UserType | null;
  hasPermission: (permission: string) => boolean;
  open?: boolean;
  onOpenChange?: () => void;
}

export const ManagementMenu: React.FC<ManagementMenuProps> = ({ 
  user, 
  hasPermission,
  open,
  onOpenChange
}) => {
  const location = useLocation();
  const { isMobile } = useIsMobile();

  if (!user || !(hasPermission('admin') || hasPermission('management'))) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger 
        className={isMobile ? "w-full justify-start" : ""}
        onClick={onOpenChange}
      >
        <Settings className="mr-2 h-4 w-4" />
        Configurações
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ScrollArea className={`${isMobile ? "h-[200px] w-full" : "h-[300px] w-[400px]"}`}>
          <div className="grid gap-3 p-4">
            {hasPermission('admin') && (
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
            {hasPermission('management') && (
              <>
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
                <Link
                  to="/contractors"
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-accent",
                    getActiveClass(location.pathname, "/contractors")
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Prestadores
                </Link>
                <Link
                  to="/clients"
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-accent",
                    getActiveClass(location.pathname, "/clients")
                  )}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Clientes
                </Link>
              </>
            )}
            {hasPermission('admin') && (
              <Link
                to="/users"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/users")
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </Link>
            )}
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
