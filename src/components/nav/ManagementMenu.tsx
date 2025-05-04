
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings, Database } from "lucide-react";
import { User } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActiveClass } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManagementMenuProps {
  user: User | null;
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

  if (!user) {
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
            <Link
              to="/clients"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/clients")
              )}
            >
              <Database className="mr-2 h-4 w-4" />
              Clientes
            </Link>
            {hasPermission("admin") && (
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
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
