
import React from "react";
import { Button } from "@/components/ui/button";
import { DeleteAlertDialog } from "./DeleteAlertDialog";

interface ActionButtonsSectionProps {
  deleteAlertOpen: boolean;
  setDeleteAlertOpen: (open: boolean) => void;
  onDelete: () => void;
}

export const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  deleteAlertOpen,
  setDeleteAlertOpen,
  onDelete
}) => {
  return (
    <>
      <div className="flex justify-end space-x-2">
        <Button variant="destructive" onClick={() => setDeleteAlertOpen(true)}>
          Excluir
        </Button>
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <DeleteAlertDialog
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onDelete={onDelete}
      />
    </>
  );
};
