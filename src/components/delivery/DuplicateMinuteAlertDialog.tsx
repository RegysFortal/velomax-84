
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
import { useDeliveryFormContext } from './context/DeliveryFormContext';

interface DuplicateMinuteAlertDialogProps {
  onConfirm: () => void;
}

export function DuplicateMinuteAlertDialog({ onConfirm }: DuplicateMinuteAlertDialogProps) {
  const { showDuplicateAlert, setShowDuplicateAlert, formData } = useDeliveryFormContext();

  return (
    <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Entrega Duplicada Detectada</AlertDialogTitle>
          <AlertDialogDescription>
            Já existe uma entrega com o número de minuta "{formData?.minuteNumber}". 
            Deseja continuar e criar uma nova entrega mesmo assim?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowDuplicateAlert(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Sim, criar entrega
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
