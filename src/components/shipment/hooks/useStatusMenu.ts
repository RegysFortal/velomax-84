import { useState } from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";
import { useStatusLabel } from './useStatusLabel';
import { useStatusAction, DeliveryDetailsType } from './useStatusAction';
import { useStatusChange } from './useStatusChange';
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";

interface UseStatusMenuProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange?: () => void;
}

export function useStatusMenu({ 
  shipmentId, 
  status, 
  onStatusChange 
}: UseStatusMenuProps) {
  const { getStatusLabel } = useStatusLabel();
  const { updateShipmentStatus, getShipmentById } = useShipments();
  const { createDeliveriesFromShipment } = useDeliveries();
  const shipment = getShipmentById(shipmentId);
  
  // Use status change hook to get the correct handler
  const { handleStatusUpdate } = useStatusChange();
  
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
  const handleStatusChange = (newStatus: ShipmentStatus) => {
    // Convert both status and newStatus to strings before comparison to avoid TypeScript errors
    const currentStatusStr = status as string;
    const newStatusStr = newStatus as string;

    // If changing to delivered_final, show document selection
    if (newStatusStr === "delivered_final") {
      setShowDocumentSelection(true);
      return;
    }
    
    // If changing to "retained", show the retention sheet
    if (newStatusStr === "retained") {
      setShowRetentionSheet(true);
      return;
    }
    
    // Otherwise, update the status directly
    handleStatusUpdate(shipmentId, newStatus);
    
    // Call the onStatusChange callback if provided
    if (onStatusChange) {
      onStatusChange();
    }
  };
  
  // Handler for delivery confirmation
  const handleDeliveryConfirm = () => {
    try {
      // Validate form
      if (!receiverName.trim() || !deliveryDate || !deliveryTime) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      // Process the delivery
      const deliveryDetails: DeliveryDetailsType = {
        receiverName,
        deliveryDate,
        deliveryTime,
        selectedDocumentIds
      };
      
      // Update shipment status with delivery details
      handleStatusUpdate(shipmentId, "delivered_final", deliveryDetails);
      
      // Create deliveries from shipment documents
      if (shipment && selectedDocumentIds.length > 0) {
        createDeliveriesFromShipment(shipment, deliveryDetails);
      }
      
      // Close dialogs
      setShowDeliveryDialog(false);
      
      // Clear state
      resetFormState();
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toast.error("Erro ao finalizar entrega");
      console.error(error);
    }
  };
  
  // Handler for retention confirmation
  const handleRetentionConfirm = () => {
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
      
      // Process the retention
      const retentionDetails = {
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      };
      
      // Update shipment status with retention details
      handleStatusUpdate(shipmentId, "retained", retentionDetails);
      
      // Close dialog
      setShowRetentionSheet(false);
      
      // Clear state
      resetFormState();
      
      // Call the onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toast.error("Erro ao reter embarque");
      console.error(error);
    }
  };
  
  // Reset all form state
  const resetFormState = () => {
    setSelectedDocumentIds([]);
    setReceiverName("");
    setDeliveryDate("");
    setDeliveryTime("");
    setRetentionReason("");
    setRetentionAmount("");
    setPaymentDate("");
    setReleaseDate("");
    setActionNumber("");
    setFiscalNotes("");
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
    
    // Utilities
    getStatusLabel
  };
}
