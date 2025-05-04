
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DollarSign, FileText, CreditCard, Calendar } from "lucide-react";
import { User } from "@/types";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActiveClass } from "./navUtils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  onOpenChange
}) => {
  const location = useLocation();
  const { isMobile } = useIsMobile();

  if (!user || !hasPermission("financial")) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger
        className={isMobile ? "w-full justify-start" : ""}
        onClick={onOpenChange}
      >
        <DollarSign className="mr-2 h-4 w-4" />
        Financeiro
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ScrollArea className={`${isMobile ? "h-[200px] w-full" : "h-[300px] w-[400px]"}`}>
          <div className="grid gap-3 p-4">
            <Link
              to="/financial"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/financial")
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              Relatórios Financeiros
            </Link>
            <Link
              to="/financial-dashboard"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/financial-dashboard")
              )}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Dashboard Financeiro
            </Link>
            <Link
              to="/accounts/receivable"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/accounts/receivable")
              )}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Contas a Receber
            </Link>
            <Link
              to="/accounts/payable"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-accent",
                getActiveClass(location.pathname, "/accounts/payable")
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Contas a Pagar
            </Link>
          </div>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
