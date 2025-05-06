
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

export const PermissionsTab = memo(function PermissionsTab({
  isLoadingPermissions,
  permissionsInitialized,
  permissions,
  onChange,
  isAdmin
}: PermissionsTabProps) {
  console.log("Rendering PermissionsTab with:", { isLoadingPermissions, permissionsInitialized, isAdmin });
  
  return (
    <div className="space-y-4" data-testid="permissions-tab">
      <div className="pb-2">
        <p className="text-sm text-muted-foreground">
          {isAdmin 
            ? 'Administradores têm acesso total a todos os recursos do sistema.' 
            : 'Configure as permissões de acesso para este usuário:'}
        </p>
      </div>
      
      {isLoadingPermissions ? (
        <div className="py-4 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
          <p className="text-sm text-muted-foreground">Carregando permissões...</p>
        </div>
      ) : !permissionsInitialized ? (
        <div className="py-4 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
          <p className="text-sm text-muted-foreground">Inicializando permissões...</p>
        </div>
      ) : (
        <PermissionsSection 
          permissions={permissions || {}} 
          onChange={onChange}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
});

export default PermissionsTab;
