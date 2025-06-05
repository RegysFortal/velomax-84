
import React from "react";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useAdminArea } from "@/contexts/AdminAreaContext";
import { OperationalMenu } from "./nav/OperationalMenu";
import { FinancialMenu } from "./nav/FinancialMenu";
import { ManagementMenu } from "./nav/ManagementMenu";
import { FleetMenu } from "./nav/FleetMenu";
import { InventoryMenu } from "./nav/InventoryMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavMenu() {
  const { user, hasPermission } = useAuth();
  const { isAdminArea } = useAdminArea();
  const { isMobile } = useIsMobile();

  // Prevent duplicate menu openings with this state
  const [openMenuIndex, setOpenMenuIndex] = React.useState<number | null>(null);

  const handleMenuOpen = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <NavigationMenu className={isMobile ? "w-full" : ""}>
      <NavigationMenuList className={isMobile ? "flex-col w-full items-start space-y-2" : ""}>
        <OperationalMenu 
          user={user} 
          hasPermission={hasPermission}
          open={openMenuIndex === 0} 
          onOpenChange={() => handleMenuOpen(0)} 
        />
        
        {/* Financeiro - só aparece na área administrativa */}
        {isAdminArea && (
          <FinancialMenu 
            user={user} 
            hasPermission={hasPermission}
            open={openMenuIndex === 1} 
            onOpenChange={() => handleMenuOpen(1)} 
          />
        )}
        
        {/* Frota - só aparece na área administrativa */}
        {isAdminArea && (
          <FleetMenu 
            user={user} 
            hasPermission={hasPermission}
            open={openMenuIndex === 2} 
            onOpenChange={() => handleMenuOpen(2)} 
          />
        )}
        
        <InventoryMenu 
          user={user} 
          hasPermission={hasPermission}
          open={openMenuIndex === 3} 
          onOpenChange={() => handleMenuOpen(3)} 
        />
        
        {/* Configurações (Administração) - só aparece na área administrativa */}
        {isAdminArea && (
          <ManagementMenu 
            user={user} 
            hasPermission={hasPermission}
            open={openMenuIndex === 4} 
            onOpenChange={() => handleMenuOpen(4)} 
          />
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
