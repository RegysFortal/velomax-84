
import { useShipments } from '@/contexts/shipments';
import { toast } from 'sonner';

interface UseDocumentDeletionProps {
  shipmentId: string;
}

/**
 * Hook for handling document deletion
 */
export function useDocumentDeletion({ shipmentId }: UseDocumentDeletionProps) {
  const { deleteDocument } = useShipments();
  
  /**
   * Deletes a document with confirmation
   */
  const handleDelete = async (documentId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este documento?")) {
      try {
        await deleteDocument(shipmentId, documentId);
        toast.success("Documento excluído com sucesso");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Erro ao excluir documento");
      }
    }
  };

  return { handleDelete };
}
