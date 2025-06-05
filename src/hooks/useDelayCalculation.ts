
import { Document, Shipment } from "@/types/shipment";
import { differenceInDays } from "date-fns";

export function useDelayCalculation() {
  const calculateDocumentDelay = (document: Document, shipment: Shipment): number => {
    const today = new Date();
    const createdDate = new Date(shipment.createdAt);
    
    // Calculate delay based on days since shipment creation
    return Math.max(0, differenceInDays(today, createdDate));
  };

  const generatePriorityNotification = (document: Document, shipment: Shipment) => {
    const delayDays = calculateDocumentDelay(document, shipment);
    
    return {
      clientName: shipment.companyName,
      trackingNumber: shipment.trackingNumber,
      minuteNumber: document.minuteNumber || 'N/A',
      status: document.status,
      delayDays,
      observation: `Documento prioritário - ${delayDays} dias de atraso`,
      documentId: document.id,
      shipmentId: shipment.id,
      createdAt: new Date().toISOString(),
    };
  };

  return {
    calculateDocumentDelay,
    generatePriorityNotification,
  };
}
