
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const NavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    roles: ["admin", "user", "manager"]
  },
  {
    title: "Clientes",
    href: "/clients",
    icon: "clients",
    roles: ["admin", "user", "manager"]
  },
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
    title: "Relatórios",
    href: "/reports",
    icon: "reports",
    roles: ["admin", "user", "manager"]
  },
  {
    title: "Relatórios de Embarques",
    href: "/shipment-reports",
    icon: "shipment-reports",
    roles: ["admin", "user", "manager"]
  },
  {
    title: "Financeiro",
    href: "/financial",
    icon: "financial",
    roles: ["admin", "manager"]
  },
  {
    title: "Logbook",
    href: "/logbook",
    icon: "logbook",
    roles: ["admin", "user", "manager"]
  },
  {
    title: "Cidades",
    href: "/cities",
    icon: "cities",
    roles: ["admin", "manager"]
  },
  {
    title: "Veículos",
    href: "/vehicles",
    icon: "vehicles",
    roles: ["admin", "manager"]
  },
  {
    title: "Colaboradores",
    href: "/employees",
    icon: "employees",
    roles: ["admin", "manager"]
  },
  {
    title: "Manutenções",
    href: "/maintenance",
    icon: "maintenance",
    roles: ["admin", "manager"]
  },
  {
    title: "Tabelas de Preços",
    href: "/price-tables",
    icon: "price-tables",
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
];

export function MainNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isMobile } = useIsMobile();
  const userRole = user?.role || 'user';
  
  // Filter nav items based on user role
  const filteredNavItems = NavItems.filter(item => 
    item.roles.includes(userRole)
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
            <MobileNav items={filteredNavItems} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      ) : (
        <nav className={cn("hidden md:flex flex-row items-center gap-6 text-sm", className)}>
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "transition-colors hover:text-foreground/80",
                  isActive ? "text-foreground font-medium" : "text-foreground/60"
                )
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}

interface MobileNavProps {
  items: typeof NavItems;
  setOpen: (open: boolean) => void;
}

function MobileNav({ items, setOpen }: MobileNavProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="flex flex-col gap-2 pl-2 pr-6">
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
      </ScrollArea>
    </div>
  );
}
