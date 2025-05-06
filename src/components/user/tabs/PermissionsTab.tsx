
import React, { memo } from 'react';
import { PermissionLevel } from '@/types';
import { PermissionsSection } from '../table/PermissionsSection';

interface PermissionsTabProps {
  isLoadingPermissions: boolean;
  permissionsInitialized: boolean;
  permissions: Record<string, PermissionLevel>;
  onChange: (name: string, level: keyof PermissionLevel, value: boolean) => void;
  isAdmin: boolean;
}

// Using memo to prevent unnecessary re-renders
export const PermissionsTab = memo(function PermissionsTab({
  isLoadingPermissions,
  permissionsInitialized,
  permissions,
  onChange,
  isAdmin
}: PermissionsTabProps) {
  if (isLoadingPermissions) {
    return (
      <div className="py-12 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Carregando permissões...</p>
      </div>
    );
  }
  
  if (!permissionsInitialized) {
    return (
      <div className="py-12 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Inicializando permissões...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-2">
        <p className="text-sm text-muted-foreground">
          {isAdmin 
            ? 'Administradores têm acesso total a todos os recursos do sistema.' 
            : 'Configure as permissões de acesso para este usuário:'}
        </p>
      </div>
      <PermissionsSection 
        permissions={permissions} 
        onChange={onChange}
        isAdmin={isAdmin}
      />
    </div>
  );
});

export default PermissionsTab;
