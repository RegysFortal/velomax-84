
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeliveryFormContext } from "./context/DeliveryFormContext";
import { useDeliveryFormSubmit } from "./hooks/useDeliveryFormSubmit";

interface DuplicateMinuteAlertDialogProps {
  onConfirm(): void;
}

export const DuplicateMinuteAlertDialog: React.FC<DuplicateMinuteAlertDialogProps> = ({
  onConfirm,
}) => {
  const {
    showDuplicateAlert,
    setShowDuplicateAlert,
    formData,
    form,
  } = useDeliveryFormContext();

  // Confirm handler delegates to useDeliveryFormSubmit logic
  return (
    <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Número de minuta duplicado</AlertDialogTitle>
          <AlertDialogDescription>
            Já existe uma entrega com o número de minuta{" "}
            <span className="font-semibold">{form.watch("minuteNumber")}</span> para este cliente.
            Deseja realmente criar outra entrega com o mesmo número?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm()}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Sim, criar mesmo assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
