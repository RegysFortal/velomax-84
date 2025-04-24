
import React from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/auth/AuthContext"
import { OperationalMenu } from "./nav/OperationalMenu"
import { FinancialMenu } from "./nav/FinancialMenu"
import { ManagementMenu } from "./nav/ManagementMenu"
import { FleetMenu } from "./nav/FleetMenu"
import { InventoryMenu } from "./nav/InventoryMenu"

const NavigationMenuDemo = () => {
  const { isMobile } = useIsMobile();
  const { user, hasPermission } = useAuth();
  
  return (
    <NavigationMenu>
      <NavigationMenuList className={isMobile ? "flex-col items-start" : ""}>
        <OperationalMenu user={user} hasPermission={hasPermission} />
        <FinancialMenu user={user} hasPermission={hasPermission} />
        <FleetMenu user={user} hasPermission={hasPermission} />
        <InventoryMenu user={user} hasPermission={hasPermission} />
        <ManagementMenu user={user} hasPermission={hasPermission} />
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  const { isMobile } = useIsMobile();
  
  return (
    <li className={isMobile ? "w-full" : ""}>
      <Link to={props.href || ""} className="no-underline">
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              isMobile ? "w-full" : "",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </Link>
    </li>
  )
})
ListItem.displayName = "ListItem"

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const { isMobile } = useIsMobile();
  
  return (
    <nav className={cn(`flex items-center ${isMobile ? "w-full" : "space-x-6 lg:space-x-6"}`, className)}>
      <div className={`flex items-center ${isMobile ? "w-full" : "space-x-6"}`}>
        <NavigationMenuDemo />
      </div>
    </nav>
  )
}
