
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Package, PackagePlus, PackageMinus, BarChart } from "lucide-react";
import { User } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { getActiveClass } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface InventoryMenuProps {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  open?: boolean;
  onOpenChange?: () => void;
}

export const InventoryMenu: React.FC<InventoryMenuProps> = ({
  user,
  hasPermission,
  open,
  onOpenChange,
}) => {
  const location = useLocation();
  const { isMobile } = useIsMobile();

  // Check if user has any inventory-related permissions
  const hasProductsPermission = hasPermission("products");
  const hasEntriesPermission = hasPermission("inventoryEntries");
  const hasExitsPermission = hasPermission("inventoryExits");
  const hasDashboardPermission = hasPermission("inventoryDashboard");
  
  const hasInventoryAccess = hasProductsPermission || hasEntriesPermission || 
                            hasExitsPermission || hasDashboardPermission;

  if (!user || !hasInventoryAccess) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger
        className={isMobile ? "w-full justify-start" : ""}
        onClick={onOpenChange}
      >
        <Package className="mr-2 h-4 w-4" />
        Estoque
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
          {hasProductsPermission && (
            <Link
              to="/inventory/products"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/inventory/products")
              )}
            >
              <Package className="mr-2 h-4 w-4" />
              Produtos
            </Link>
          )}
          
          {hasEntriesPermission && (
            <Link
              to="/inventory/entries"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/inventory/entries")
              )}
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              Entradas
            </Link>
          )}
          
          {hasExitsPermission && (
            <Link
              to="/inventory/exits"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/inventory/exits")
              )}
            >
              <PackageMinus className="mr-2 h-4 w-4" />
              Saídas
            </Link>
          )}
          
          {hasDashboardPermission && (
            <Link
              to="/inventory/dashboard"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/inventory/dashboard")
              )}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard Estoque
            </Link>
          )}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
