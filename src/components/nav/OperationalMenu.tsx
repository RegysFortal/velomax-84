
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Truck, FileText, Box } from "lucide-react";
import { User } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActiveClass } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface OperationalMenuProps {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  open?: boolean;
  onOpenChange?: () => void;
}

export const OperationalMenu: React.FC<OperationalMenuProps> = ({
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
        <Truck className="mr-2 h-4 w-4" />
        Operacional
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ScrollArea className={`${isMobile ? "h-[200px] w-full" : "h-[300px] w-[400px]"}`}>
          <div className="grid gap-3 p-4">
            {hasPermission("deliveries") && (
              <Link
                to="/deliveries"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/deliveries")
                )}
              >
                <Truck className="mr-2 h-4 w-4" />
                Entregas
              </Link>
            )}
            {hasPermission("shipments") && (
              <Link
                to="/shipments"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/shipments")
                )}
              >
                <Box className="mr-2 h-4 w-4" />
                Remessas
              </Link>
            )}
            {hasPermission("budgets") && (
              <Link
                to="/budgets"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/budgets")
                )}
              >
                <FileText className="mr-2 h-4 w-4" />
                Orçamentos
              </Link>
            )}
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
