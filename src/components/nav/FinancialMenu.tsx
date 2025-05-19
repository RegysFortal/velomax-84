
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BanknoteIcon,
  BadgeDollarSign,
  ClipboardList,
  FileText,
  FileBarChart,
  MapPin,
  Receipt,
  BarChart3,
  ArrowUpDown,
} from "lucide-react";
import { User } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActiveClass, hasFinancialAccess } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface FinancialMenuProps {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  open?: boolean;
  onOpenChange?: () => void;
}

export const FinancialMenu: React.FC<FinancialMenuProps> = ({
  user,
  hasPermission,
  open,
  onOpenChange,
}) => {
  const location = useLocation();
  const { isMobile } = useIsMobile();

  // Strict financial access verification
  const hasAccess = hasFinancialAccess(user, hasPermission);
  
  // Only admins and managers can access financial menus
  if (!user || !hasAccess || (user.role !== 'admin' && user.role !== 'manager')) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger
        className={isMobile ? "w-full justify-start" : ""}
        onClick={onOpenChange}
      >
        <BanknoteIcon className="mr-2 h-4 w-4" />
        Financeiro
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ScrollArea className={`${isMobile ? "h-[300px] w-full" : "h-[400px] w-[400px]"}`}>
          <div className="grid gap-3 p-4">
            <Link
              to="/financial-dashboard"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/financial-dashboard")
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard Financeiro
            </Link>

            <Link
              to="/financial"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/financial")
              )}
            >
              <FileBarChart className="mr-2 h-4 w-4" />
              Relatórios a Fechar
            </Link>

            <Link
              to="/reports"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/reports")
              )}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Fechamento
            </Link>

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

            <Link
              to="/price-tables"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/price-tables")
              )}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Tabela de Preços
            </Link>

            <Link
              to="/accounts/receivable"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/accounts/receivable")
              )}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Contas a Receber
            </Link>

            <Link
              to="/accounts/payable"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/accounts/payable")
              )}
            >
              <BadgeDollarSign className="mr-2 h-4 w-4" />
              Contas a Pagar
            </Link>

            <Link
              to="/accounts/reports"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/accounts/reports")
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              Relatórios Financeiros
            </Link>
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
