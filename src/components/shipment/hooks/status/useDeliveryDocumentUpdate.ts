
import { ShipmentStatus } from '@/types/shipment';

interface UseDeliveryDocumentUpdateProps {
  shipmentId: string;
  updateShipment: (id: string, data: any) => Promise<any>;
  updateDocument: (shipmentId: string, documentId: string, documents: any[]) => Promise<any>;
  addDelivery: (deliveryData: any) => Promise<any>;
}

export function useDeliveryDocumentUpdate({
  shipmentId,
  updateShipment,
  updateDocument,
  addDelivery
}: UseDeliveryDocumentUpdateProps) {
  const updateDeliveryDocuments = async (
    shipment: any,
    details: any,
    updateData: any,
    newStatus: ShipmentStatus
  ) => {
    const { selectedDocumentIds, receiverName, deliveryDate, deliveryTime } = details;

    // Handle document delivery and status updates
    if (shipment.documents && shipment.documents.length > 1) {
      // Quantos documentos serão marcados como entregues
      const totalDocuments = shipment.documents.length;
      const updatedDocuments = [...shipment.documents];
      
      // Marcar os documentos selecionados como entregues
      selectedDocumentIds.forEach(docId => {
        const docIndex = updatedDocuments.findIndex(doc => doc.id === docId);
        if (docIndex >= 0) {
          updatedDocuments[docIndex] = {
            ...updatedDocuments[docIndex],
            isDelivered: true
          };
        }
      });
      
      // Contar quantos documentos estarão como entregues após atualização
      const deliveredCount = updatedDocuments.filter(doc => doc.isDelivered).length;
      
      // Determine status based on delivered documents count
      if (deliveredCount > 0 && deliveredCount < totalDocuments) {
        updateData.status = "partially_delivered";
      } else if (deliveredCount === totalDocuments) {
        updateData.status = "delivered_final";
      }
      
      // Update shipment with documents and delivery details
      await updateShipment(shipment.id, {
        ...updateData,
        receiverName,
        deliveryDate,
        deliveryTime,
        documents: updatedDocuments
      });
    } else {
      // For single document shipments
      await updateShipment(shipment.id, {
        ...updateData,
        receiverName,
        deliveryDate,
        deliveryTime
      });
      
      // Update each document individually
      for (const docId of selectedDocumentIds) {
        const docIndex = shipment.documents.findIndex(doc => doc.id === docId);
        if (docIndex >= 0) {
          const updatedDocs = [...shipment.documents];
          updatedDocs[docIndex] = {
            ...updatedDocs[docIndex],
            isDelivered: true
          };
          await updateDocument(shipment.id, docId, updatedDocs);
        }
      }
    }
    
    // Create delivery entries
    for (const docId of selectedDocumentIds) {
      await addDelivery({
        clientId: shipment.companyId,
        deliveryDate,
        deliveryTime,
        receiver: receiverName,
        weight: 0,
        packages: 0,
        deliveryType: 'standard',
        cargoType: 'standard',
        totalFreight: 0,
        notes: `Documento do embarque ${shipment.trackingNumber}`
      });
    }
    
    return updateData.status || newStatus;
  };

  return { updateDeliveryDocuments };
}
