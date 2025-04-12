
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calculator, BarChart2, FileText, Table, MapPin } from "lucide-react";
import { User } from "@/types";
import { 
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActiveClass, hasFinancialAccess } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface FinancialMenuProps {
  user: User | null;
  hasPermission: (permission: string) => boolean;
}

export const FinancialMenu: React.FC<FinancialMenuProps> = ({ user, hasPermission }) => {
  const location = useLocation();
  const { isMobile } = useIsMobile();
  
  if (!hasFinancialAccess(user, hasPermission)) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger className={isMobile ? "w-full justify-start" : ""}>
        <Calculator className="mr-2 h-4 w-4" />
        Financeiro
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
            {hasPermission('financial') && (
              <Link
                to="/financial"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/financial")
                )}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Fechamento
              </Link>
            )}
            {hasPermission('reports') && (
              <Link
                to="/reports"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/reports")
                )}
              >
                <FileText className="mr-2 h-4 w-4" />
                Relatórios a fechar
              </Link>
            )}
            {hasPermission('priceTables') && (
              <Link
                to="/price-tables"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/price-tables")
                )}
              >
                <Table className="mr-2 h-4 w-4" />
                Tabela de Preços
              </Link>
            )}
            {hasPermission('cities') && (
              <Link
                to="/cities"
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  getActiveClass(location.pathname, "/cities")
                )}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Cidades
              </Link>
            )}
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
