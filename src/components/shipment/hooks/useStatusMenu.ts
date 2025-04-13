import { useState } from 'react';
import { ShipmentStatus, Document } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";
import { toast } from "sonner";
import { useStatusLabel } from './useStatusLabel';

interface UseStatusMenuProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange?: () => void;
}

export function useStatusMenu({ shipmentId, status, onStatusChange }: UseStatusMenuProps) {
  const { updateStatus, getShipmentById, updateFiscalAction, updateDocument } = useShipments();
  const { addDelivery } = useDeliveries();
  const { getStatusLabel } = useStatusLabel();
  
  // Dialog state
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  
  // Document selection state
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  
  // Delivery form state
  const [receiverName, setReceiverName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  // Retention form state
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [actionNumber, setActionNumber] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");
  
  // Handler for status change button click
  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    try {
      // If changing to delivered_final, show document selection if the shipment has documents
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment) {
        toast.error("Embarque não encontrado");
        return;
      }
      
      if (newStatus === "delivered_final") {
        // Check if the shipment has documents
        if (shipment.documents && shipment.documents.length > 0) {
          setShowDocumentSelection(true);
        } else {
          // If no documents, show the delivery dialog directly
          setShowDeliveryDialog(true);
        }
        return;
      }
      
      // If changing to "retained", show the retention sheet
      if (newStatus === "retained") {
        setShowRetentionSheet(true);
        return;
      }
      
      // Otherwise, update the status directly
      await updateStatus(shipmentId, newStatus);
      
      // For "deliverer" -> "in_transit" transition, clear fiscal action
      if (status === "retained" && newStatus !== "retained") {
        await updateFiscalAction(shipmentId, null);
      }
      
      toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
      
      // Trigger callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toast.error("Erro ao alterar status");
      console.error(error);
    }
  };
  
  // Handler for delivery confirmation
  const handleDeliveryConfirm = async () => {
    try {
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment) {
        toast.error("Embarque não encontrado");
        return;
      }
      
      // Validate form
      if (!receiverName.trim() || !deliveryDate || !deliveryTime) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      // Get selected documents or all documents if none selected
      let documentsToDeliver: Document[] = [];
      let updatedDocuments: Document[] = [];
      
      if (shipment.documents && shipment.documents.length > 0) {
        if (selectedDocumentIds.length > 0) {
          // If specific documents were selected
          documentsToDeliver = shipment.documents.filter(doc => 
            selectedDocumentIds.includes(doc.id)
          );
          
          // Update the documents to mark them as delivered
          updatedDocuments = shipment.documents.map(doc => {
            if (selectedDocumentIds.includes(doc.id)) {
              return { ...doc, isDelivered: true };
            }
            return doc;
          });
          
          // Update documents in the database
          for (const doc of updatedDocuments.filter(d => selectedDocumentIds.includes(d.id))) {
            await updateDocument(shipmentId, doc.id, updatedDocuments);
          }
        } else {
          // If no specific documents were selected, use all documents
          documentsToDeliver = shipment.documents;
          
          // Mark all documents as delivered
          updatedDocuments = shipment.documents.map(doc => ({
            ...doc,
            isDelivered: true
          }));
          
          // Update all documents in the database
          for (const doc of updatedDocuments) {
            await updateDocument(shipmentId, doc.id, updatedDocuments);
          }
        }
      }
      
      // Update the shipment status
      await updateStatus(shipmentId, "delivered_final");
      
      // Create deliveries from documents
      if (documentsToDeliver.length > 0) {
        console.log(`Creating ${documentsToDeliver.length} deliveries from documents`);
        
        for (const document of documentsToDeliver) {
          try {
            // Generate unique minute number for each document
            const minuteNumber = document.minuteNumber || 
                            `${shipment.trackingNumber}-${document.id.substring(0, 4)}`;
            
            const deliveryData = {
              minuteNumber,
              clientId: shipment.companyId,
              deliveryDate,
              deliveryTime,
              receiver: receiverName,
              // Use document weight and packages if available, otherwise use shipment values
              weight: document.weight !== undefined ? Number(document.weight) : shipment.weight,
              packages: document.packages !== undefined ? document.packages : shipment.packages,
              deliveryType: 'standard' as const,
              cargoType: 'standard' as const,
              totalFreight: 0,
              notes: `Entrega do documento ${document.name} do embarque ${shipment.trackingNumber}`
            };
            
            // Add invoice numbers to notes if they exist
            if (document.invoiceNumbers && document.invoiceNumbers.length > 0) {
              const invoiceList = document.invoiceNumbers.join(', ');
              deliveryData.notes = `${deliveryData.notes}\nNotas Fiscais: ${invoiceList}`;
            }
            
            await addDelivery(deliveryData);
            console.log(`Created delivery for document: ${document.name}`);
          } catch (error) {
            console.error(`Error creating delivery for document ${document.name}:`, error);
          }
        }
        
        toast.success(`${documentsToDeliver.length} entregas criadas com sucesso`);
      } else {
        // If no documents, create a single delivery from the shipment
        try {
          const minuteNumber = `${shipment.trackingNumber}-${new Date().getTime().toString().slice(-4)}`;
          
          const deliveryData = {
            minuteNumber,
            clientId: shipment.companyId,
            deliveryDate,
            deliveryTime,
            receiver: receiverName,
            weight: shipment.weight,
            packages: shipment.packages,
            deliveryType: 'standard' as const,
            cargoType: 'standard' as const,
            totalFreight: 0,
            notes: `Entrega gerada do embarque ${shipment.trackingNumber}`
          };
          
          await addDelivery(deliveryData);
          toast.success("Entrega criada com sucesso");
        } catch (error) {
          console.error("Error creating delivery:", error);
          toast.error("Erro ao criar entrega");
        }
      }
      
      // Close dialog
      setShowDeliveryDialog(false);
      
      // Clear state
      setSelectedDocumentIds([]);
      setReceiverName("");
      setDeliveryDate("");
      setDeliveryTime("");
      
      // Trigger callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
      
      // Trigger an event to refresh the deliveries list
      window.dispatchEvent(new Event('deliveries-updated'));
      
    } catch (error) {
      toast.error("Erro ao finalizar entrega");
      console.error(error);
    }
  };
  
  // Handler for retention confirmation
  const handleRetentionConfirm = async () => {
    try {
      // Validate form
      if (!retentionReason.trim()) {
        toast.error("Informe o motivo da retenção");
        return;
      }
      
      const amountValue = parseFloat(retentionAmount || "0");
      
      if (isNaN(amountValue) || amountValue < 0) {
        toast.error("Valor da retenção deve ser um número válido");
        return;
      }
      
      // Update shipment status
      await updateStatus(shipmentId, "retained");
      
      // Create fiscal action
      await updateFiscalAction(shipmentId, {
        actionNumber: actionNumber.trim() || undefined,
        reason: retentionReason.trim(),
        amountToPay: amountValue,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes.trim() || undefined,
      });
      
      // Close dialog
      setShowRetentionSheet(false);
      
      // Clear state
      setRetentionReason("");
      setRetentionAmount("");
      setPaymentDate("");
      setReleaseDate("");
      setActionNumber("");
      setFiscalNotes("");
      
      toast.success("Status alterado para Retida");
      
      // Trigger callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toast.error("Erro ao reter embarque");
      console.error(error);
    }
  };
  
  return {
    // Dialog state
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
    // Document selection state
    selectedDocumentIds,
    setSelectedDocumentIds,
    
    // Delivery form state
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    
    // Retention form state
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
    
    // Action handlers
    handleStatusChange,
    handleDeliveryConfirm,
    handleRetentionConfirm,
    getStatusLabel
  };
}
