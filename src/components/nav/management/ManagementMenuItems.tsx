
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Users, Building2, User } from "lucide-react";
import { getActiveClass } from "../navUtils";

interface ManagementMenuItemsProps {
  location: { pathname: string };
  hasPermission: (permission: string) => boolean;
}

export function ManagementMenuItems({ location, hasPermission }: ManagementMenuItemsProps) {
  if (!hasPermission('management')) return null;
  
  return (
    <>
      {hasPermission('employees') && (
        <>
          <Link
            to="/employees"
            className={cn(
              "flex items-center p-2 rounded-md hover:bg-accent",
              getActiveClass(location.pathname, "/employees")
            )}
          >
            <Users className="mr-2 h-4 w-4" />
            Funcionários
          </Link>
          
          <Link
            to="/contractors"
            className={cn(
              "flex items-center p-2 rounded-md hover:bg-accent",
              getActiveClass(location.pathname, "/contractors")
            )}
          >
            <User className="mr-2 h-4 w-4" />
            Terceiros
          </Link>
        </>
      )}
      
      {hasPermission('clients') && (
        <Link
          to="/clients"
          className={cn(
            "flex items-center p-2 rounded-md hover:bg-accent",
            getActiveClass(location.pathname, "/clients")
          )}
        >
          <Building2 className="mr-2 h-4 w-4" />
          Clientes
        </Link>
      )}
    </>
  );
}
