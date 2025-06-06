
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Warehouse, PackagePlus, PackageMinus, BarChart, Package } from "lucide-react";
import { User } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { getActiveClass } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface StorageMenuProps {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  open?: boolean;
  onOpenChange?: () => void;
}

export const StorageMenu: React.FC<StorageMenuProps> = ({
  user,
  hasPermission,
  open,
  onOpenChange,
}) => {
  const location = useLocation();
  const { isMobile } = useIsMobile();

  // Check if user has any storage-related permissions
  const hasProductsPermission = hasPermission("products");
  const hasEntriesPermission = hasPermission("storageEntries");
  const hasExitsPermission = hasPermission("storageExits");
  const hasDashboardPermission = hasPermission("storageDashboard");
  
  const hasStorageAccess = hasProductsPermission || hasEntriesPermission || 
                          hasExitsPermission || hasDashboardPermission;

  if (!user || !hasStorageAccess) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger
        className={isMobile ? "w-full justify-start" : ""}
        onClick={onOpenChange}
      >
        <Warehouse className="mr-2 h-4 w-4" />
        Armazenagem
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
          {hasProductsPermission && (
            <Link
              to="/storage/products"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/storage/products")
              )}
            >
              <Package className="mr-2 h-4 w-4" />
              Produtos
            </Link>
          )}
          
          {hasEntriesPermission && (
            <Link
              to="/storage/entries"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/storage/entries")
              )}
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              Entradas
            </Link>
          )}
          
          {hasExitsPermission && (
            <Link
              to="/storage/exits"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/storage/exits")
              )}
            >
              <PackageMinus className="mr-2 h-4 w-4" />
              Saídas
            </Link>
          )}
          
          {hasDashboardPermission && (
            <Link
              to="/storage/dashboard"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/storage/dashboard")
              )}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard Armazenagem
            </Link>
          )}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
