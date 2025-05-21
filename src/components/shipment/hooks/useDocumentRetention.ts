
import { useState } from 'react';
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";

export function useDocumentRetention(shipmentId: string, documentId: string, onSuccess?: () => void) {
  // Estado para o formulário de retenção
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  const [retentionReason, setRetentionReason] = useState('');
  const [retentionAmount, setRetentionAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [actionNumber, setActionNumber] = useState('');
  const [fiscalNotes, setFiscalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { getShipmentById, updateDocument, refreshShipmentsData } = useShipments();
  
  // Manipulador para quando o formulário de retenção é confirmado
  const handleRetentionConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      // Validar campos
      if (!retentionReason.trim()) {
        toast.error("O motivo da retenção é obrigatório");
        setIsSubmitting(false);
        return;
      }
      
      // Primeiro atualizar o status do documento para retido
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment || !shipment.documents) {
        toast.error("Não foi possível encontrar os documentos do embarque");
        setIsSubmitting(false);
        return;
      }
      
      // Criar lista de documentos atualizada com o status de retenção
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === documentId) {
          // Create document-specific retention info
          const docRetentionInfo = {
            actionNumber: actionNumber.trim() || undefined,
            reason: retentionReason.trim() || "Retenção fiscal",
            amount: retentionAmount || "0",
            paymentDate: paymentDate || undefined,
            releaseDate: releaseDate || undefined,
            notes: fiscalNotes?.trim() || undefined
          };
          
          return {
            ...doc,
            isDelivered: false,
            isRetained: true,
            isPickedUp: false,
            retentionInfo: docRetentionInfo
          };
        }
        return doc;
      });
      
      // Atualizar o documento
      await updateDocument(shipmentId, documentId, updatedDocuments);
      
      // Verificar se qualquer documento está retido para atualizar o status do embarque
      const hasRetainedDocs = updatedDocuments.some(doc => doc.isRetained);
      if (hasRetainedDocs) {
        // Fechar o formulário de retenção
        setShowRetentionSheet(false);
        
        // Resetar campos do formulário
        resetFormFields();
        
        // Forçar atualização dos dados
        refreshShipmentsData();
        
        // Exibir mensagem de sucesso
        toast.success("Documento marcado como Retido e informações salvas");
        
        // Chamar o callback de sucesso se fornecido
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error confirming retention:", error);
      toast.error("Erro ao marcar documento como retido");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Resetar campos do formulário
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
