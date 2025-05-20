
import { useShipments } from '@/contexts/shipments';
import { Document } from '@/types/shipment';
import { toast } from 'sonner';

interface UseDocumentSubmissionProps {
  shipmentId: string;
  setIsDialogOpen: (isOpen: boolean) => void;
}

/**
 * Hook for handling document submission
 */
export function useDocumentSubmission({ 
  shipmentId, 
  setIsDialogOpen 
}: UseDocumentSubmissionProps) {
  const { addDocument, updateDocument } = useShipments();
  
  /**
   * Validates the document form data
   */
  const validateDocument = (
    packageCount: number | undefined, 
    weightValue: number | undefined
  ): boolean => {
    if (packageCount !== undefined && isNaN(packageCount)) {
      toast.error("Número de volumes deve ser um valor numérico válido");
      return false;
    }
    
    if (weightValue !== undefined && isNaN(weightValue)) {
      toast.error("Peso deve ser um valor numérico válido");
      return false;
    }
    
    return true;
  };

  /**
   * Handle submit for creating a new document
   */
  const handleCreateDocument = async (
    minuteNumber: string,
    invoiceNumbers: string[],
    packages: string,
    weight: string,
    notes: string,
    isDelivered: boolean
  ) => {
    try {
      const packageCount = packages ? parseInt(packages) : undefined;
      const weightValue = weight ? parseFloat(weight) : undefined;
      
      // Validate
      if (!validateDocument(packageCount, weightValue)) return;
      
      // Generate a document name if none provided
      const docName = `Documento ${Date.now()}`;
      
      await addDocument(shipmentId, {
        name: docName,
        type: "invoice", // Default type
        minuteNumber: minuteNumber.trim() || undefined,
        invoiceNumbers: [...invoiceNumbers], // Make a copy to ensure array is preserved
        packages: packageCount,
        weight: weightValue,
        notes: notes.trim() || undefined,
        isDelivered
      });
      
      toast.success("Documento adicionado com sucesso");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Erro ao salvar documento");
    }
  };

  /**
   * Handle submit for updating an existing document
   */
  const handleUpdateDocument = async (
    editingDocument: Document,
    minuteNumber: string,
    invoiceNumbers: string[],
    packages: string,
    weight: string,
    notes: string,
    isDelivered: boolean
  ) => {
    try {
      const packageCount = packages ? parseInt(packages) : undefined;
      const weightValue = weight ? parseFloat(weight) : undefined;
      
      // Validate
      if (!validateDocument(packageCount, weightValue)) return;
      
      // Update existing document
      const updatedDocument = {
        ...editingDocument,
        minuteNumber: minuteNumber.trim() || undefined,
        invoiceNumbers: [...invoiceNumbers], // Make a copy to ensure array is preserved
        packages: packageCount,
        weight: weightValue,
        notes: notes.trim() || undefined,
        isDelivered
      };
      
      console.log("Updating document:", updatedDocument);
      
      await updateDocument(shipmentId, editingDocument.id, [updatedDocument]);
      toast.success("Documento atualizado com sucesso");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Erro ao atualizar documento");
    }
  };
  
  return {
    handleCreateDocument,
    handleUpdateDocument
  };
}
