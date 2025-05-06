
import React from 'react';
import { PermissionLevel } from '@/types';
import { PermissionCheckbox } from './PermissionCheckbox';

interface PermissionRowProps {
  name: string;
  label: string;
  permission: PermissionLevel;
  onChange: (name: string, level: keyof PermissionLevel, value: boolean) => void;
  isAdmin?: boolean;
}

export const PermissionRow = ({ 
  name, 
  label, 
  permission, 
  onChange,
  isAdmin = false
}: PermissionRowProps) => {
  const handleChange = (level: keyof PermissionLevel) => (value: boolean) => {
    onChange(name, level, value);
  };

  // Admin sempre tem acesso total a tudo
  const isDisabled = isAdmin;
  const isChecked = (level: keyof PermissionLevel) => isAdmin || permission[level];

  return (
    <div className="grid grid-cols-5 gap-2 items-center py-1 border-b border-gray-100">
      <div className="text-sm font-medium col-span-1">{label}</div>
      <div className="col-span-1 flex justify-center">
        <PermissionCheckbox 
          checked={isChecked('view')} 
          onCheckedChange={handleChange('view')}
          label="Ver"
          disabled={isDisabled}
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <PermissionCheckbox 
          checked={isChecked('create')} 
          onCheckedChange={handleChange('create')}
          label="Incluir"
          disabled={isDisabled}
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <PermissionCheckbox 
          checked={isChecked('edit')} 
          onCheckedChange={handleChange('edit')}
          label="Editar"
          disabled={isDisabled}
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <PermissionCheckbox 
          checked={isChecked('delete')} 
          onCheckedChange={handleChange('delete')}
          label="Excluir"
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};
