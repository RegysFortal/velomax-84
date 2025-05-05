
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface CompanyActionsProps {
  onSave: () => void;
  disabled?: boolean;
  isSaving?: boolean;
}

export function CompanyActions({ onSave, disabled = false, isSaving = false }: CompanyActionsProps) {
  return (
    <CardFooter className="flex justify-between">
      <Button 
        onClick={onSave} 
        disabled={disabled || isSaving}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "Salvando..." : disabled ? "Sem permissão para salvar" : "Salvar Alterações"}
      </Button>
    </CardFooter>
  );
}
