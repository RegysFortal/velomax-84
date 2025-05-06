
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { getActiveClass } from "../navUtils";

interface SettingsMenuItemsProps {
  location: { pathname: string };
  hasSettingsAccess: boolean;
}

export function SettingsMenuItems({ location, hasSettingsAccess }: SettingsMenuItemsProps) {
  if (!hasSettingsAccess) return null;
  
  return (
    <Link
      to="/settings"
      className={cn(
        "flex items-center p-2 rounded-md hover:bg-accent",
        getActiveClass(location.pathname, "/settings")
      )}
    >
      <Settings className="mr-2 h-4 w-4" />
      Configuração de Sistema
    </Link>
  );
}
