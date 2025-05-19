
import { Shipment, FiscalAction } from "@/types/shipment";
import { useFiscalActionUpdate } from "./hooks/fiscal-actions/useFiscalActionUpdate";
import { useFiscalActionClear } from "./hooks/fiscal-actions/useFiscalActionClear";
import { toast } from "sonner";

export const useFiscalActions = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const { updateFiscalAction: updateAction } = useFiscalActionUpdate(shipments, setShipments);
  const { clearFiscalAction: clearAction } = useFiscalActionClear(shipments, setShipments);

  // Wrapper para updateFiscalAction para manter a interface consistente
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: any) => {
    console.log("Chamando updateFiscalAction com dados:", { shipmentId, fiscalActionData });
    
    try {
      return await updateAction(shipmentId, fiscalActionData);
    } catch (error) {
      console.error("Erro em updateFiscalAction:", error);
      toast.error("Erro ao atualizar ação fiscal");
      throw error;
    }
  };

  // Update fiscal action details without creating a new one
  const updateFiscalActionDetails = async (
    shipmentId: string, 
    actionNumber?: string,
    releaseDate?: string,
    notes?: string
  ) => {
    try {
      console.log("Atualizando detalhes da ação fiscal:", {
        shipmentId,
        actionNumber,
        releaseDate,
        notes
      });
      
      // Get current shipment to find fiscal action
      const shipment = shipments.find(s => s.id === shipmentId);
      if (!shipment || !shipment.fiscalAction) {
        console.error("Não foi possível atualizar detalhes: ação fiscal não encontrada");
        return;
      }
      
      // Verificar se há alterações para evitar chamadas desnecessárias à API
      const currentAction = shipment.fiscalAction;
      const hasChanges = 
        (actionNumber !== undefined && actionNumber !== currentAction.actionNumber) ||
        (releaseDate !== undefined && releaseDate !== currentAction.releaseDate) ||
        (notes !== undefined && notes !== currentAction.notes);
        
      if (!hasChanges) {
        console.log("Nenhuma alteração detectada nos detalhes da ação fiscal");
        return currentAction;
      }
      
      // Preparar dados para atualização
      const updateData: Partial<FiscalAction> = {
        ...currentAction // Começar com os dados atuais para manter todos os campos
      };
      
      // Sobrescrever apenas os campos que foram fornecidos
      if (actionNumber !== undefined) updateData.actionNumber = actionNumber;
      if (releaseDate !== undefined) updateData.releaseDate = releaseDate;
      if (notes !== undefined) updateData.notes = notes;
      
      console.log("Dados completos para atualização:", updateData);
      
      // Usar a função updateFiscalAction para garantir persistência
      const updatedFiscalAction = await updateAction(shipmentId, updateData);
      console.log("Ação fiscal atualizada com sucesso:", updatedFiscalAction);
      
      return updatedFiscalAction;
    } catch (error) {
      console.error("Erro em updateFiscalActionDetails:", error);
      toast.error("Erro ao atualizar detalhes da ação fiscal");
      throw error;
    }
  };
  
  // Clear fiscal action - retorna void conforme especificado na interface
  const clearFiscalAction = async (shipmentId: string): Promise<void> => {
    try {
      await clearAction(shipmentId);
    } catch (error) {
      console.error("Erro ao limpar ação fiscal:", error);
      toast.error("Erro ao remover ação fiscal");
      throw error;
    }
  };

  return {
    updateFiscalAction,
    clearFiscalAction,
    updateFiscalActionDetails
  };
};
