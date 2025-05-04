
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface CompanyActionsProps {
  onSave: () => void;
}

export function CompanyActions({ onSave }: CompanyActionsProps) {
  return (
    <CardFooter className="flex justify-between">
      <Button onClick={onSave}>Salvar Alterações</Button>
    </CardFooter>
  );
}
