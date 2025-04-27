
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function FormActions({ onSubmit, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      <Button onClick={onSubmit}>Salvar</Button>
    </div>
  );
}
