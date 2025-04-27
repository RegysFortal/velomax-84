
import React from "react";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Package, PackagePlus, PackageMinus, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ListItemProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  className?: string;
}

const ListItem = ({ href, title, icon, className }: ListItemProps) => {
  const { isMobile } = useIsMobile();
  
  return (
    <li className={isMobile ? "w-full" : ""}>
      <Link to={href} className="no-underline">
        <NavigationMenuLink asChild>
          <a
            className={cn(
              "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              isMobile ? "w-full" : "",
              className
            )}
          >
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-sm font-medium">{title}</span>
            </div>
          </a>
        </NavigationMenuLink>
      </Link>
    </li>
  );
};

interface InventoryMenuProps {
  user: any;
  hasPermission: (permission: string) => boolean;
}

export function InventoryMenu({ user, hasPermission }: InventoryMenuProps) {
  const { isMobile } = useIsMobile();
  
  if (!user || !hasPermission("inventory:view")) {
    return null;
  }

  return (
    <NavigationMenuItem className={isMobile ? "w-full" : ""}>
      <NavigationMenuTrigger className={isMobile ? "w-full justify-between" : ""}>
        <Package className="mr-2 h-4 w-4" />
        Estoque
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ScrollArea className={`${isMobile ? "h-[250px]" : "h-[300px]"} w-[250px]`}>
          <ul className="flex flex-col p-4 gap-2">
            <ListItem 
              href="/inventory/products" 
              title="Produtos"
              icon={<Package className="h-4 w-4" />}
            />
            <ListItem 
              href="/inventory/entries" 
              title="Entradas"
              icon={<PackagePlus className="h-4 w-4" />}
            />
            <ListItem 
              href="/inventory/exits" 
              title="Saídas"
              icon={<PackageMinus className="h-4 w-4" />}
            />
            <ListItem 
              href="/inventory/dashboard" 
              title="Dashboard"
              icon={<Database className="h-4 w-4" />}
            />
          </ul>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
