
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { PermissionLevel } from '@/types';

interface PermissionCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export const PermissionCheckbox = ({ 
  checked, 
  onCheckedChange, 
  label, 
  disabled = false 
}: PermissionCheckboxProps) => {
  return (
    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
      <FormControl>
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </FormControl>
      <FormLabel className="font-normal cursor-pointer text-xs">
        {label}
      </FormLabel>
    </FormItem>
  );
};

