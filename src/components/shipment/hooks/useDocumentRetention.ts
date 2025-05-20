
import { useState } from 'react';
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { DocumentStatus } from "@/types/shipment";

export function useDocumentRetention(shipmentId: string, documentId: string, onSuccess?: () => void) {
  // State for retention form
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  const [retentionReason, setRetentionReason] = useState('');
  const [retentionAmount, setRetentionAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [actionNumber, setActionNumber] = useState('');
  const [fiscalNotes, setFiscalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { getShipmentById, updateDocument, updateFiscalAction, updateShipment, refreshShipmentsData } = useShipments();
  
  // Handler for when retention form is confirmed
  const handleRetentionConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate fields
      if (!retentionReason.trim()) {
        toast.error("O motivo da retenção é obrigatório");
        setIsSubmitting(false);
        return;
      }
      
      // First update document status to retained
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment || !shipment.documents) {
        toast.error("Não foi possível encontrar os documentos do embarque");
        setIsSubmitting(false);
        return;
      }
      
      // Create updated document list with the retained status
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            isDelivered: false,
            isRetained: true,
            isPickedUp: false
          };
        }
        return doc;
      });
      
      // Update the document
      await updateDocument(shipmentId, documentId, updatedDocuments);

      // Calculate amount value
      let amountValue = 0;
      if (retentionAmount) {
        const cleanedAmount = retentionAmount.replace(',', '.');
        amountValue = parseFloat(cleanedAmount);
        if (isNaN(amountValue)) amountValue = 0;
      }
      
      // Now update the fiscal action with retention information
      const fiscalActionData = {
        actionNumber: actionNumber.trim() || undefined,
        reason: retentionReason.trim() || "Retenção fiscal",
        amountToPay: amountValue,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes?.trim() || undefined
      };
      
      // Update fiscal action
      await updateFiscalAction(shipmentId, fiscalActionData);
      
      // Update the shipment's retention status
      await updateShipment(shipmentId, { 
        isRetained: true,
        status: "retained" as const
      });
      
      // Close the retention form
      setShowRetentionSheet(false);
      
      // Reset form fields
      resetFormFields();
      
      // Force refresh data
      refreshShipmentsData();
      
      // Show success message
      toast.success("Documento marcado como Retido e informações salvas");
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error confirming retention:", error);
      toast.error("Erro ao marcar documento como retido");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form fields
  const resetFormFields = () => {
    setRetentionReason('');
    setRetentionAmount('');
    setPaymentDate('');
    setReleaseDate('');
    setActionNumber('');
    setFiscalNotes('');
  };
  
  return {
    retentionState: {
      showRetentionSheet,
      setShowRetentionSheet,
      retentionReason,
      setRetentionReason,
      retentionAmount,
      setRetentionAmount,
      paymentDate,
      setPaymentDate,
      releaseDate,
      setReleaseDate,
      actionNumber,
      setActionNumber,
      fiscalNotes,
      setFiscalNotes,
      isSubmitting
    },
    handleRetentionConfirm,
    resetFormFields
  };
}
