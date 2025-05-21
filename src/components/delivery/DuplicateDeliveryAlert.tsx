
import React from 'react';
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

interface DuplicateDeliveryAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  minuteNumber: string;
  onConfirm: () => void;
}

export function DuplicateDeliveryAlert({
  open,
  onOpenChange,
  minuteNumber,
  onConfirm
}: DuplicateDeliveryAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Entrega já existente</AlertDialogTitle>
          <AlertDialogDescription>
            Essa entrega com a minuta <span className="font-semibold">{minuteNumber}</span> já foi incluída.
            Deseja incluir novamente?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            NÃO
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-orange-600 hover:bg-orange-700">
            SIM
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
