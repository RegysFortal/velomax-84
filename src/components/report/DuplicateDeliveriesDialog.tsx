
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
} from '@/components/ui/alert-dialog';

interface DuplicateDeliveriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicateCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DuplicateDeliveriesDialog({
  open,
  onOpenChange,
  duplicateCount,
  onConfirm,
  onCancel
}: DuplicateDeliveriesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Entregas já incluídas em relatórios</AlertDialogTitle>
          <AlertDialogDescription>
            {duplicateCount === 1 
              ? "1 entrega já foi incluída em outro relatório." 
              : `${duplicateCount} entregas já foram incluídas em outros relatórios.`
            }
            <br /><br />
            Deseja continuar mesmo assim? Isso pode resultar em entregas duplicadas nos relatórios.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Continuar mesmo assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
