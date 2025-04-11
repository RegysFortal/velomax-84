
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

interface DuplicateTrackingAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackingNumber: string;
  onConfirm: () => void;
}

export function DuplicateTrackingAlert({
  open,
  onOpenChange,
  trackingNumber,
  onConfirm
}: DuplicateTrackingAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Número de conhecimento duplicado</AlertDialogTitle>
          <AlertDialogDescription>
            Já existe um embarque com o número de conhecimento <span className="font-semibold">{trackingNumber}</span>.
            Deseja realmente criar outro embarque com o mesmo número?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-orange-600 hover:bg-orange-700">
            Sim, criar mesmo assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
