
import React from "react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/auth/AuthContext";
import { OperationalMenu } from "./nav/OperationalMenu";
import { FinancialMenu } from "./nav/FinancialMenu";
import { ManagementMenu } from "./nav/ManagementMenu";

export function NavMenu() {
  const { user, hasPermission } = useAuth();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <OperationalMenu user={user} hasPermission={hasPermission} />
        <FinancialMenu user={user} hasPermission={hasPermission} />
        <ManagementMenu user={user} hasPermission={hasPermission} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
