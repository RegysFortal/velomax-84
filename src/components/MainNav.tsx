import React from "react"
import { Link, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/contexts/AuthContext";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  return (
    <nav className={cn("flex items-center space-x-6 lg:space-x-6", className)}>
      <Logo className="h-8 w-8" />
      <div className="hidden md:flex gap-6">
        {hasPermission('dashboard') && (
          <Link
            to="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
        )}
        
        {hasPermission('deliveries') && (
          <Link
            to="/deliveries"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/deliveries" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Entregas
          </Link>
        )}
        
        {hasPermission('clients') && (
          <Link
            to="/clients"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/clients" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Clientes
          </Link>
        )}
        
        {hasPermission('shipments') && (
          <Link
            to="/shipments"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/shipments" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Embarques
          </Link>
        )}
        
        {hasPermission('reports') && (
          <Link
            to="/reports"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/reports" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Relatórios
          </Link>
        )}
        
        {hasPermission('financial') && (
          <Link
            to="/financial"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/financial" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Financeiro
          </Link>
        )}
        
        {hasPermission('logbook') && (
          <Link
            to="/logbook"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/logbook" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Diário de Bordo
          </Link>
        )}
        
        {hasPermission('maintenance') && (
          <Link
            to="/maintenance"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/maintenance" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Manutenção
          </Link>
        )}
        
        {user?.role === 'admin' && (
          <Link
            to="/activity-logs"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/activity-logs" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Atividades
          </Link>
        )}
      </div>
    </nav>
  )
}
