
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

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Operacional</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[240px]">
              <ListItem href="/deliveries" title="Entregas">
                Gerenciamento de entregas
              </ListItem>
              <ListItem href="/shipments" title="Embarques">
                Gerenciamento de embarques
              </ListItem>
              <ListItem href="/shipment-reports" title="Relatórios de Embarques">
                Relatórios de embarques
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Financeiro</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[240px]">
              <ListItem href="/financial" title="Financeiro">
                Gerenciamento financeiro
              </ListItem>
              <ListItem href="/reports" title="Relatórios">
                Relatórios financeiros
              </ListItem>
              <ListItem href="/price-tables" title="Tabela de Preços">
                Gerenciar tabelas de preços
              </ListItem>
              <ListItem href="/cities" title="Cidades">
                Gerenciar cidades
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gerência</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[240px]">
              <ListItem href="/dashboard" title="Dashboard">
                Painel de controle
              </ListItem>
              <ListItem href="/logbook" title="Diário de Bordo">
                Gerenciar diário de bordo
              </ListItem>
              <ListItem href="/clients" title="Clientes">
                Gerenciar clientes
              </ListItem>
              <ListItem href="/employees" title="Funcionários">
                Gerenciar funcionários
              </ListItem>
              <ListItem href="/vehicles" title="Veículos">
                Gerenciar veículos
              </ListItem>
              <ListItem href="/maintenance" title="Manutenções">
                Gerenciar manutenções
              </ListItem>
              <ListItem href="/activity-logs" title="Logs de Atividades">
                Histórico de atividades
              </ListItem>
              <ListItem href="/settings" title="Configurações">
                Configurações do sistema
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <Link to={props.href || ""} className="no-underline">
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
  return (
    <nav className={cn("flex items-center space-x-6 lg:space-x-6", className)}>
      <div className="flex items-center space-x-6">
        <NavigationMenuDemo />
      </div>
    </nav>
  )
}
