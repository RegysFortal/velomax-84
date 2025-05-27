
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsSectionProps {
  isEditMode: boolean;
  onCancel?: () => void;
  submitting?: boolean;
}

export const FormActionsSection: React.FC<FormActionsSectionProps> = ({
  isEditMode,
  onCancel,
  submitting = false
}) => (
  <div className="flex justify-end space-x-2 pt-4 border-t">
    <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
      Cancelar
    </Button>
    <Button type="submit" disabled={submitting}>
      {submitting ? 'Salvando...' : "Salvar Entrega"}
    </Button>
  </div>
);
