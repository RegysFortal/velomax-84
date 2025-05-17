
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

interface ReportDialogsProps {
  reportToClose: FinancialReport | null;
  setReportToClose: (report: FinancialReport | null) => void;
  reportToEdit: FinancialReport | null;
  setReportToEdit: (report: FinancialReport | null) => void;
  reportToDelete: string | null;
  setReportToDelete: (reportId: string | null) => void;
  onCloseReport: (reportId: string, paymentMethod: string, dueDate: string) => Promise<void>;
  onEditPaymentDetails: (reportId: string, paymentMethod: string | null, dueDate: string | null) => Promise<void>;
  onDeleteReport: (reportId: string) => Promise<void>;
}

export const ReportDialogs: React.FC<ReportDialogsProps> = ({
  reportToClose,
  setReportToClose,
  reportToEdit,
  setReportToEdit,
  reportToDelete,
  setReportToDelete,
  onCloseReport,
  onEditPaymentDetails,
  onDeleteReport
}) => {
  const handleDelete = async () => {
    if (reportToDelete) {
      await onDeleteReport(reportToDelete);
      setReportToDelete(null);
    }
  };

  return (
    <>
      {/* Diálogo para fechar relatório com informações de pagamento */}
      {reportToClose && (
        <CloseReportDialog
          report={reportToClose}
          open={Boolean(reportToClose)}
          onOpenChange={(open) => !open && setReportToClose(null)}
          onClose={onCloseReport}
        />
      )}
      
      {/* Diálogo para editar detalhes de pagamento */}
      {reportToEdit && (
        <EditPaymentDetailsDialog
          report={reportToEdit}
          open={Boolean(reportToEdit)}
          onOpenChange={(open) => !open && setReportToEdit(null)}
          onSave={onEditPaymentDetails}
        />
      )}
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
