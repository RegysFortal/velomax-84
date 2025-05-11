
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
import { CloseReportDialog } from '@/components/financial/CloseReportDialog';
import { EditPaymentDetailsDialog } from '@/components/financial/EditPaymentDetailsDialog';
import { FinancialReport } from '@/types';

interface FinancialDialogsProps {
  reportToClose: FinancialReport | null;
  onReportCloseChange: (open: boolean) => void;
  onClose: (reportId: string, paymentMethod: string, dueDate: string) => Promise<void>;
  reportToEdit: FinancialReport | null;
  onReportEditChange: (open: boolean) => void;
  onSave: (reportId: string, paymentMethod: string | null, dueDate: string | null) => Promise<void>;
  reportToDelete: string | null;
  onReportDeleteChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
}

export function FinancialDialogs({
  reportToClose,
  onReportCloseChange,
  onClose,
  reportToEdit,
  onReportEditChange,
  onSave,
  reportToDelete,
  onReportDeleteChange,
  onDelete
}: FinancialDialogsProps) {
  return (
    <>
      {/* Dialog to close report with payment information */}
      {reportToClose && (
        <CloseReportDialog
          report={reportToClose}
          open={Boolean(reportToClose)}
          onOpenChange={onReportCloseChange}
          onClose={onClose}
        />
      )}
      
      {/* Dialog to edit payment details */}
      {reportToEdit && (
        <EditPaymentDetailsDialog
          report={reportToEdit}
          open={Boolean(reportToEdit)}
          onOpenChange={onReportEditChange}
          onSave={onSave}
        />
      )}
      
      {/* Confirmation dialog for deletion */}
      <AlertDialog open={!!reportToDelete} onOpenChange={onReportDeleteChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
