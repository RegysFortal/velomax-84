
import React from "react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/auth/AuthContext";
import { OperationalMenu } from "./nav/OperationalMenu";
import { FinancialMenu } from "./nav/FinancialMenu";
import { ManagementMenu } from "./nav/ManagementMenu";
import { FleetMenu } from "./nav/FleetMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavMenu() {
  const { user, hasPermission } = useAuth();
  const { isMobile } = useIsMobile();

  return (
    <NavigationMenu className={isMobile ? "w-full" : ""}>
      <NavigationMenuList className={isMobile ? "flex-col w-full items-start space-y-2" : ""}>
        <OperationalMenu user={user} hasPermission={hasPermission} />
        <FinancialMenu user={user} hasPermission={hasPermission} />
        <FleetMenu user={user} hasPermission={hasPermission} />
        <ManagementMenu user={user} hasPermission={hasPermission} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
