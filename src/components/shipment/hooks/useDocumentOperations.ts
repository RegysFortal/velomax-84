
import { useEffect } from 'react';
import { Document } from '@/types/shipment';
import { 
  useDocumentDialogState, 
  useDocumentFormState,
  useDocumentSubmission,
  useDocumentDeletion
} from './document-operations';

interface UseDocumentOperationsProps {
  shipmentId: string;
}

export function useDocumentOperations({ shipmentId }: UseDocumentOperationsProps) {
  // Use the refactored hooks
  const dialogState = useDocumentDialogState();
  const formState = useDocumentFormState(dialogState.editingDocument);
  const submission = useDocumentSubmission({ 
    shipmentId, 
    setIsDialogOpen: dialogState.setIsDialogOpen 
  });
  const deletion = useDocumentDeletion({ shipmentId });
  
  // Effect to load document data when editing
  useEffect(() => {
    if (dialogState.editingDocument) {
      formState.loadDocumentData(dialogState.editingDocument);
    } else {
      formState.resetFormData();
    }
  }, [dialogState.editingDocument]);
  
  /**
   * Submits the document form for adding or editing
   */
  const handleSubmit = async () => {
    // Log invoice numbers for debugging
    console.log("Submitting document with invoice numbers:", formState.invoiceNumbers);
    
    if (dialogState.editingDocument) {
      await submission.handleUpdateDocument(
        dialogState.editingDocument,
        formState.minuteNumber,
        formState.invoiceNumbers,
        formState.packages,
        formState.weight,
        formState.notes,
        formState.isDelivered
      );
    } else {
      await submission.handleCreateDocument(
        formState.minuteNumber,
        formState.invoiceNumbers,
        formState.packages,
        formState.weight,
        formState.notes,
        formState.isDelivered
      );
    }
  };
  
  // Combine all hooks into a single interface
  return {
    ...dialogState,
    ...formState,
    handleSubmit,
    handleDelete: deletion.handleDelete
  };
}
