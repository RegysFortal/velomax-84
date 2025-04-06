
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Reorganized menu items by categories
const NavStructure = {
  Operacional: [
    {
      title: "Entregas",
      href: "/deliveries",
      icon: "deliveries",
      roles: ["admin", "user", "manager"]
    },
    {
      title: "Embarques",
      href: "/shipments",
      icon: "shipments",
      roles: ["admin", "user", "manager"]
    },
    {
      title: "Relatórios de Embarques",
      href: "/shipment-reports",
      icon: "shipment-reports",
      roles: ["admin", "user", "manager"]
    },
  ],
  Financeiro: [
    {
      title: "Financeiro",
      href: "/financial",
      icon: "financial",
      roles: ["admin", "manager"]
    },
    {
      title: "Relatórios",
      href: "/reports",
      icon: "reports",
      roles: ["admin", "user", "manager"]
    },
    {
      title: "Tabelas de Preços",
      href: "/price-tables",
      icon: "price-tables",
      roles: ["admin", "manager"]
    },
    {
      title: "Cidades",
      href: "/cities",
      icon: "cities",
      roles: ["admin", "manager"]
    },
  ],
  Gerencia: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
      roles: ["admin", "user", "manager"]
    },
    {
      title: "Diário de Bordo",
      href: "/logbook",
      icon: "logbook",
      roles: ["admin", "user", "manager"]
    },
    {
      title: "Clientes",
      href: "/clients",
      icon: "clients",
      roles: ["admin", "user", "manager"]
    },
    {
      title: "Colaboradores",
      href: "/employees",
      icon: "employees",
      roles: ["admin", "manager"]
    },
    {
      title: "Veículos",
      href: "/vehicles",
      icon: "vehicles",
      roles: ["admin", "manager"]
    },
    {
      title: "Manutenções",
      href: "/maintenance",
      icon: "maintenance",
      roles: ["admin", "manager"]
    },
    {
      title: "Logs de Atividades",
      href: "/activity-logs",
      icon: "activity-logs",
      roles: ["admin"]
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: "settings",
      roles: ["admin", "manager"]
    },
  ]
};

export function MainNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isMobile } = useIsMobile();
  const userRole = user?.role || 'user';

  // Filter menu items based on user role
  const filteredNavStructure = Object.fromEntries(
    Object.entries(NavStructure).map(([category, items]) => [
      category,
      items.filter(item => item.roles.includes(userRole))
    ])
  );

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="block md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav navStructure={filteredNavStructure} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      ) : (
        <NavigationMenu className={cn("hidden md:flex", className)}>
          <NavigationMenuList>
            {Object.entries(filteredNavStructure).map(([category, items]) => (
              items.length > 0 && (
                <NavigationMenuItem key={category}>
                  <NavigationMenuTrigger className="text-foreground/80 hover:text-foreground/100">
                    {category}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      {items.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <NavLink
                              to={item.href}
                              className={({ isActive }) =>
                                cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  isActive ? "bg-accent text-accent-foreground" : "text-foreground/80"
                                )
                              }
                            >
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                            </NavLink>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </>
  );
}

interface MobileNavProps {
  navStructure: Record<string, typeof NavStructure.Operacional>;
  setOpen: (open: boolean) => void;
}

function MobileNav({ navStructure, setOpen }: MobileNavProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] py-4">
      <div className="flex flex-col gap-4 px-2">
        {Object.entries(navStructure).map(([category, items]) => (
          items.length > 0 && (
            <div key={category} className="flex flex-col">
              <Button
                variant="ghost"
                className="flex w-full justify-between items-center mb-1 font-medium"
                onClick={() => toggleCategory(category)}
              >
                {category}
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform", 
                    expandedCategories[category] ? "transform rotate-180" : ""
                  )} 
                />
              </Button>
              {expandedCategories[category] && (
                <div className="flex flex-col gap-1 pl-4">
                  {items.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )
                      }
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </ScrollArea>
  );
}
