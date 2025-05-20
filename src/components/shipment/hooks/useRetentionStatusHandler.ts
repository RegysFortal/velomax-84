
import { useState } from 'react';
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { ShipmentStatus, DocumentStatus } from "@/types/shipment";

interface UseRetentionStatusHandlerProps {
  shipmentId: string;
  retentionReason: string;
  retentionAmount: string;
  paymentDate: string;
  releaseDate: string;
  actionNumber: string;
  fiscalNotes: string;
  selectedDocumentIds?: string[];
  handleStatusUpdate: (shipmentId: string, status: ShipmentStatus, details?: any) => void;
  onStatusChange?: () => void;
  resetForms: () => void;
}

/**
 * Hook to handle retention status confirmation
 */
export function useRetentionStatusHandler({
  shipmentId,
  retentionReason,
  retentionAmount,
  paymentDate,
  releaseDate,
  actionNumber,
  fiscalNotes,
  selectedDocumentIds = [],
  handleStatusUpdate,
  onStatusChange,
  resetForms
}: UseRetentionStatusHandlerProps) {
  const { getShipmentById, updateDocument } = useShipments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handler for retention confirmation button click
   */
  const handleRetentionConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      if (!retentionReason.trim()) {
        toast.error("O motivo da retenção é obrigatório");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Retention confirmed with details:", {
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        actionNumber,
        fiscalNotes,
        selectedDocumentIds
      });
      
      // Build retention details object
      const retentionDetails = {
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        actionNumber,
        fiscalNotes,
        selectedDocumentIds
      };
      
      // Update shipment status to retained
      handleStatusUpdate(shipmentId, "retained", retentionDetails);
      
      // If specific documents were selected for retention, update their status
      if (selectedDocumentIds && selectedDocumentIds.length > 0) {
        const shipment = getShipmentById(shipmentId);
        
        if (shipment && shipment.documents) {
          // Create updated document list with selected documents marked
          const updatedDocuments = shipment.documents.map(doc => {
            if (selectedDocumentIds.includes(doc.id)) {
              // Mark selected documents with a "retained" status indicator
              return { 
                ...doc, 
                isRetained: true, 
                isDelivered: false,
                isPickedUp: false
              };
            }
            return doc;
          });
          
          // Update each document one by one
          for (const docId of selectedDocumentIds) {
            await updateDocument(shipmentId, docId, updatedDocuments);
          }
        }
      }
      
      // Reset the forms
      resetForms();
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
      
      toast.success("Status alterado para Retido e informações salvas");
    } catch (error) {
      console.error("Error confirming retention:", error);
      toast.error("Erro ao confirmar retenção");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleRetentionConfirm,
    isSubmitting
  };
}
