
import React from "react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/auth/AuthContext";
import { OperationalMenu } from "./nav/OperationalMenu";
import { FinancialMenu } from "./nav/FinancialMenu";
import { ManagementMenu } from "./nav/ManagementMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavMenu() {
  const { user, hasPermission } = useAuth();
  const { isMobile } = useIsMobile();

  return (
    <NavigationMenu className={isMobile ? "fixed top-0 z-50 w-full bg-background/95 backdrop-blur" : ""}>
      <NavigationMenuList className={isMobile ? "flex-col w-full items-start" : ""}>
        <OperationalMenu user={user} hasPermission={hasPermission} />
        <FinancialMenu user={user} hasPermission={hasPermission} />
        <ManagementMenu user={user} hasPermission={hasPermission} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
