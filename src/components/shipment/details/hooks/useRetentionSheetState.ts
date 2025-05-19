
import { useState, useEffect } from "react";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

export const useRetentionSheetState = (
  shipmentId: string,
  initialActionNumber: string,
  initialRetentionReason: string,
  initialRetentionAmount: string,
  initialPaymentDate: string,
  initialReleaseDate: string,
  initialFiscalNotes: string,
  onSuccess?: () => void
) => {
  // Estado para visibilidade da folha de retenção
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  
  // Estados locais para rastrear se os valores foram alterados
  const [actionNumber, setActionNumber] = useState(initialActionNumber);
  const [retentionReason, setRetentionReason] = useState(initialRetentionReason);
  const [retentionAmount, setRetentionAmount] = useState(initialRetentionAmount);
  const [paymentDate, setPaymentDate] = useState(initialPaymentDate);
  const [releaseDate, setReleaseDate] = useState(initialReleaseDate);
  const [fiscalNotes, setFiscalNotes] = useState(initialFiscalNotes);

  // Atualizar os estados quando os valores iniciais mudarem
  useEffect(() => {
    setActionNumber(initialActionNumber);
    setRetentionReason(initialRetentionReason);
    setRetentionAmount(initialRetentionAmount);
    setPaymentDate(initialPaymentDate);
    setReleaseDate(initialReleaseDate);
    setFiscalNotes(initialFiscalNotes);
  }, [
    initialActionNumber,
    initialRetentionReason,
    initialRetentionAmount,
    initialPaymentDate,
    initialReleaseDate,
    initialFiscalNotes
  ]);

  // Obter updateFiscalAction do contexto de ShipmentsContext
  const { updateFiscalAction } = useShipments();

  // Handler para clique no botão de edição
  const handleEditClick = () => {
    console.log("Abrindo folha de retenção para edição");
    setShowRetentionSheet(true);
  };

  // Handler para submissão do formulário de retenção
  const handleRetentionUpdate = async (
    newActionNumber: string,
    newRetentionReason: string,
    newRetentionAmount: string,
    newPaymentDate: string,
    newReleaseDate: string,
    newFiscalNotes: string
  ) => {
    if (!shipmentId) return;
    
    try {
      console.log("Atualizando detalhes de retenção com valores:", {
        shipmentId,
        newActionNumber,
        newRetentionReason,
        newRetentionAmount,
        newPaymentDate,
        newReleaseDate,
        newFiscalNotes
      });
      
      // Analisar o valor de retenção para garantir que seja um número válido
      const amountValue = parseFloat(newRetentionAmount) || 0;
      
      // Criar objeto de dados da ação fiscal
      const fiscalActionData = {
        actionNumber: newActionNumber,
        reason: newRetentionReason,
        amountToPay: amountValue,
        paymentDate: newPaymentDate || null,
        releaseDate: newReleaseDate || null,
        notes: newFiscalNotes || null
      };
      
      console.log("Enviando dados para updateFiscalAction:", fiscalActionData);
      
      // Usar updateFiscalAction diretamente do contexto
      const result = await updateFiscalAction(shipmentId, fiscalActionData);
      console.log("Resultado da atualização:", result);
      
      setShowRetentionSheet(false);
      toast.success("Informações de retenção atualizadas com sucesso");

      // Chamar callback onSuccess se fornecido
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao atualizar detalhes de retenção:", error);
      toast.error("Erro ao atualizar informações de retenção");
    }
  };

  return {
    showRetentionSheet,
    setShowRetentionSheet,
    actionNumber,
    setActionNumber,
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    releaseDate,
    setReleaseDate,
    fiscalNotes,
    setFiscalNotes,
    handleEditClick,
    handleRetentionUpdate
  };
};
