
import { Shipment, FiscalAction } from "@/types/shipment";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useFiscalActionUpdate = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: Partial<FiscalAction> | null): Promise<FiscalAction | null> => {
    try {
      const now = new Date().toISOString();
      const shipment = shipments.find(s => s.id === shipmentId);
      
      if (!shipment) {
        throw new Error("Embarque não encontrado");
      }

      // Se fiscalActionData for null, excluir a ação fiscal
      if (fiscalActionData === null) {
        if (shipment.fiscalAction) {
          console.log("Removendo ação fiscal com ID:", shipment.fiscalAction.id);
          
          const { error } = await supabase
            .from('fiscal_actions')
            .delete()
            .eq('id', shipment.fiscalAction.id);
            
          if (error) {
            console.error("Erro ao excluir ação fiscal:", error);
            throw error;
          }
          
          // Atualizar o estado para remover a ação fiscal
          const updatedShipments = shipments.map(s => {
            if (s.id === shipmentId) {
              const { fiscalAction, ...restShipment } = s;
              return { 
                ...restShipment, 
                updatedAt: now
              };
            }
            return s;
          });
          
          setShipments(updatedShipments);
          return null;
        }
        return null;
      }

      let fiscalAction: FiscalAction;
      
      if (shipment.fiscalAction) {
        // Atualizar ação fiscal existente
        const supabaseFiscalAction: Record<string, any> = {
          updated_at: now
        };
        
        // Mapear apenas os campos que foram fornecidos
        if (fiscalActionData.actionNumber !== undefined) supabaseFiscalAction.action_number = fiscalActionData.actionNumber;
        if (fiscalActionData.reason !== undefined) supabaseFiscalAction.reason = fiscalActionData.reason;
        if (fiscalActionData.amountToPay !== undefined) supabaseFiscalAction.amount_to_pay = fiscalActionData.amountToPay;
        if (fiscalActionData.paymentDate !== undefined) supabaseFiscalAction.payment_date = fiscalActionData.paymentDate;
        if (fiscalActionData.releaseDate !== undefined) supabaseFiscalAction.release_date = fiscalActionData.releaseDate;
        if (fiscalActionData.notes !== undefined) supabaseFiscalAction.notes = fiscalActionData.notes;
        
        console.log("Atualizando ação fiscal com ID:", shipment.fiscalAction.id);
        console.log("Dados para atualização:", supabaseFiscalAction);
        
        const { error, data } = await supabase
          .from('fiscal_actions')
          .update(supabaseFiscalAction)
          .eq('id', shipment.fiscalAction.id)
          .select('*')
          .single();
          
        if (error) {
          console.error("Erro ao atualizar ação fiscal:", error);
          throw error;
        }
        
        console.log("Resposta do Supabase após atualização:", data);
        
        // Combinar os dados existentes com as atualizações
        fiscalAction = {
          ...shipment.fiscalAction,
          ...fiscalActionData,
          updatedAt: now
        };
      } else {
        // Criar nova ação fiscal
        console.log("Criando nova ação fiscal para embarque:", shipmentId);
        
        // Garantir que todos os campos obrigatórios estejam presentes
        const supabaseFiscalAction = {
          shipment_id: shipmentId,
          action_number: fiscalActionData.actionNumber || null,
          reason: fiscalActionData.reason || 'Não especificado',
          amount_to_pay: fiscalActionData.amountToPay !== undefined ? fiscalActionData.amountToPay : 0,
          payment_date: fiscalActionData.paymentDate || null,
          release_date: fiscalActionData.releaseDate || null,
          notes: fiscalActionData.notes || null,
          created_at: now,
          updated_at: now
        };
        
        console.log("Dados para criação de ação fiscal:", supabaseFiscalAction);
        
        // Inserir ação fiscal no Supabase
        const { data: newFiscalAction, error } = await supabase
          .from('fiscal_actions')
          .insert(supabaseFiscalAction)
          .select('*')
          .single();
          
        if (error) {
          console.error("Erro ao criar ação fiscal:", error);
          throw error;
        }
        
        console.log("Nova ação fiscal criada:", newFiscalAction);
        
        // Mapear a resposta do Supabase para nosso tipo FiscalAction
        fiscalAction = {
          id: newFiscalAction.id,
          actionNumber: newFiscalAction.action_number,
          reason: newFiscalAction.reason,
          amountToPay: newFiscalAction.amount_to_pay,
          paymentDate: newFiscalAction.payment_date,
          releaseDate: newFiscalAction.release_date,
          notes: newFiscalAction.notes,
          createdAt: newFiscalAction.created_at,
          updatedAt: newFiscalAction.updated_at
        };
      }
      
      // Atualizar o estado com a ação fiscal nova ou atualizada
      const updatedShipments = shipments.map(s => {
        if (s.id === shipmentId) {
          return { 
            ...s, 
            fiscalAction,
            updatedAt: now
          };
        }
        return s;
      });
      
      setShipments(updatedShipments);
      return fiscalAction;
    } catch (error) {
      console.error("Erro ao atualizar ação fiscal:", error);
      toast.error("Erro ao atualizar ação fiscal");
      throw error;
    }
  };

  return { updateFiscalAction };
};
