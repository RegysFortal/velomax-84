
import { v4 as uuidv4 } from "uuid";
import { Shipment, FiscalAction } from "@/types/shipment";
import { FiscalActionCreateData } from "./types";

export const useFiscalActions = (
  shipments: Shipment[],
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>
) => {
  const updateFiscalAction = async (shipmentId: string, fiscalActionData: FiscalActionCreateData) => {
    const now = new Date().toISOString();
    const fiscalAction: FiscalAction = {
      ...fiscalActionData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          fiscalAction,
          isRetained: true,
          status: "retained",
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
    return fiscalAction;
  };
  
  const updateFiscalActionDetails = async (shipmentId: string, updates: Partial<FiscalAction>) => {
    const now = new Date().toISOString();
    
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId && s.fiscalAction) {
        const updatedFiscalAction = {
          ...s.fiscalAction,
          ...updates,
          updatedAt: now
        };
        
        return {
          ...s,
          fiscalAction: updatedFiscalAction,
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
    const shipment = updatedShipments.find(s => s.id === shipmentId);
    return shipment?.fiscalAction;
  };
  
  const clearFiscalAction = async (shipmentId: string) => {
    const now = new Date().toISOString();
    const updatedShipments = shipments.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          fiscalAction: undefined,
          isRetained: false,
          updatedAt: now
        };
      }
      return s;
    });
    
    setShipments(updatedShipments);
  };
  
  return {
    updateFiscalAction,
    updateFiscalActionDetails,
    clearFiscalAction
  };
};
