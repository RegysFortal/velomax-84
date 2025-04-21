
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsSectionProps {
  isEditMode: boolean;
  onCancel?: () => void;
}

export const FormActionsSection: React.FC<FormActionsSectionProps> = ({
  isEditMode,
  onCancel,
}) => (
  <div className="flex justify-end space-x-2">
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancelar
    </Button>
    <Button type="submit">
      {isEditMode ? "Atualizar Entrega" : "Registrar Entrega"}
    </Button>
  </div>
);
