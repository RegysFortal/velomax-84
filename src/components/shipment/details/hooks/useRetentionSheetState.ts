
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
  
  // Estado para rastrear se os formulários foram submetidos
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar os estados quando os valores iniciais mudarem
  useEffect(() => {
    setActionNumber(initialActionNumber || '');
    setRetentionReason(initialRetentionReason || '');
    setRetentionAmount(initialRetentionAmount || '');
    setPaymentDate(initialPaymentDate || '');
    setReleaseDate(initialReleaseDate || '');
    setFiscalNotes(initialFiscalNotes || '');
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

  // Formatar número para garantir formato correto
  const formatNumber = (value: string): number => {
    // Remover caracteres não numéricos, exceto ponto decimal
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Converter para número
    const numValue = parseFloat(cleanValue);
    
    // Retornar 0 se for NaN
    return isNaN(numValue) ? 0 : numValue;
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
    
    // Prevenir submissões múltiplas
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
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
      
      // Validar campos obrigatórios
      if (!newRetentionReason) {
        toast.error("O motivo da retenção é obrigatório");
        setIsSubmitting(false);
        return;
      }
      
      // Analisar o valor de retenção para garantir que seja um número válido
      const amountValue = formatNumber(newRetentionAmount);
      
      // Criar objeto de dados da ação fiscal
      const fiscalActionData = {
        actionNumber: newActionNumber.trim(),
        reason: newRetentionReason.trim(),
        amountToPay: amountValue,
        paymentDate: newPaymentDate || null,
        releaseDate: newReleaseDate || null,
        notes: newFiscalNotes?.trim() || null
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
    } finally {
      setIsSubmitting(false);
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
    handleRetentionUpdate,
    isSubmitting
  };
};
