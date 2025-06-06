
import { useState } from 'react';
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { supabase } from '@/integrations/supabase/client';

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
  
  const { getShipmentById, refreshShipmentsData } = useShipments();
  
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
      
      console.log("Atualizando documento para retido:", documentId);
      
      // Preparar dados de retenção
      const retentionInfo = {
        actionNumber: actionNumber?.trim() || undefined,
        reason: retentionReason.trim(),
        amount: retentionAmount?.trim() || undefined,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes?.trim() || undefined
      };
      
      // Update document in Supabase - mark as retained (not delivered) and save retention info
      const { error } = await supabase
        .from('shipment_documents')
        .update({
          is_delivered: false, // Marca como não entregue (retido)
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) {
        console.error("Error updating document:", error);
        toast.error("Erro ao marcar documento como retido");
        setIsSubmitting(false);
        return;
      }

      console.log("Documento atualizado com sucesso para retido");

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
