
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface CompanyActionsProps {
  onSave: () => void;
  disabled?: boolean;
}

export function CompanyActions({ onSave, disabled = false }: CompanyActionsProps) {
  return (
    <CardFooter className="flex justify-between">
      <Button onClick={onSave} disabled={disabled}>
        {disabled ? "Sem permissão para salvar" : "Salvar Alterações"}
      </Button>
    </CardFooter>
  );
}
