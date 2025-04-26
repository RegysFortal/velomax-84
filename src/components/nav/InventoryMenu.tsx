import React from "react";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Package, PackagePlus, PackageMinus, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
});
ListItem.displayName = "ListItem";

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
          <NavigationMenuList className="flex flex-col p-4 gap-2">
            <ListItem 
              href="/inventory/products" 
              title="Produtos"
              className="flex gap-2"
            >
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Cadastro e gestão de produtos e materiais</span>
              </div>
            </ListItem>
            <ListItem 
              href="/inventory/entries" 
              title="Entradas"
              className="flex gap-2"
            >
              <div className="flex items-center gap-2">
                <PackagePlus className="h-4 w-4" />
                <span>Registro de entradas de materiais no estoque</span>
              </div>
            </ListItem>
            <ListItem 
              href="/inventory/exits" 
              title="Saídas"
              className="flex gap-2"
            >
              <div className="flex items-center gap-2">
                <PackageMinus className="h-4 w-4" />
                <span>Registro de saídas de materiais do estoque</span>
              </div>
            </ListItem>
            <ListItem 
              href="/inventory/dashboard" 
              title="Dashboard"
              className="flex gap-2"
            >
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Consulta e controle geral do estoque</span>
              </div>
            </ListItem>
          </NavigationMenuList>
        </ScrollArea>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
