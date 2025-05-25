
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
          <AlertDialogTitle>Conhecimento já cadastrado</AlertDialogTitle>
          <AlertDialogDescription>
            Já existe um embarque com o número de conhecimento <span className="font-semibold">{trackingNumber}</span> para este cliente.
            Deseja continuar a cadastrar um novo com o mesmo número ou cancelar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-orange-600 hover:bg-orange-700">
            Continuar mesmo assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
