
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, Building2, User } from "lucide-react";
import { getActiveClass } from "../navUtils";

interface ManagementLinksProps {
  hasManagementAccess: boolean;
  hasEmployeesPermission: boolean;
  hasClientsPermission: boolean;
}

export function ManagementLinks({ 
  hasManagementAccess, 
  hasEmployeesPermission, 
  hasClientsPermission 
}: ManagementLinksProps) {
  const location = useLocation();
  
  if (!hasManagementAccess) {
    return null;
  }
  
  return (
    <>
      {hasEmployeesPermission && (
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
      )}
      
      {hasEmployeesPermission && (
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
      )}
      
      {hasClientsPermission && (
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
