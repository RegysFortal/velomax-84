
import { useState } from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { DeliveryDetailsType } from "@/components/shipment/hooks/useStatusAction";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

interface UseStatusActionsHandlerProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

export function useStatusActionsHandler({
  shipmentId,
  status,
  onStatusChange
}: UseStatusActionsHandlerProps) {
  const { getShipmentById, updateFiscalAction } = useShipments();

  // Dialog visibility states
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);

  // Selected document IDs for partial delivery
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  // Form states for delivery dialog
  const [receiverName, setReceiverName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  // Form states for retention sheet
  const [retentionReason, setRetentionReason] = useState('');
  const [retentionAmount, setRetentionAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [actionNumber, setActionNumber] = useState('');
  const [fiscalNotes, setFiscalNotes] = useState('');

  // Handler for status change click
  const handleStatusChangeClick = (newStatus: ShipmentStatus) => {
    console.log(`Status action requested: ${status} -> ${newStatus}`);
    
    // If changing to delivered_final, show document selection
    if (newStatus === "delivered_final" || newStatus === "partially_delivered") {
      setShowDocumentSelection(true);
      return;
    }
    
    // If changing to "retained", show the retention sheet
    if (newStatus === "retained") {
      setShowRetentionSheet(true);
      return;
    }
    
    // Otherwise, just update status directly
    onStatusChange(newStatus);
  };
  
  // Handler for delivery dialog confirmation
  const handleDeliveryConfirm = () => {
    console.log('Delivery dialog confirmed with:', {
      receiverName,
      deliveryDate,
      deliveryTime,
      selectedDocumentIds
    });
    
    setShowDeliveryDialog(false);
    
    // Determine if this is a partial or full delivery
    const newStatus = selectedDocumentIds.length > 0 
      ? (selectedDocumentIds.length < 2 ? "partially_delivered" : "delivered_final") 
      : "delivered_final";
    
    console.log(`Setting status to ${newStatus} based on selected documents:`, selectedDocumentIds);
    
    // Call parent handler with delivery details
    onStatusChange(newStatus, {
      receiverName,
      deliveryDate,
      deliveryTime,
      selectedDocumentIds
    });
  };
  
  // Handler for retention sheet confirmation
  const handleRetentionConfirm = () => {
    setShowRetentionSheet(false);
    
    // Call parent handler with retention details
    onStatusChange("retained", {
      retentionReason,
      retentionAmount,
      paymentDate,
      releaseDate,
      actionNumber,
      fiscalNotes
    } as any);
  };

  // Handler specifically for retention details updates
  const handleRetentionUpdate = async () => {
    if (!shipmentId) return;
    
    try {
      console.log("Updating retention details with new values:", {
        shipmentId,
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      });
      
      // Validate required fields
      if (!retentionReason.trim()) {
        toast.error("O motivo da retenção é obrigatório");
        return;
      }
      
      // Create the fiscal action data object with all fields explicitly defined
      const fiscalActionData = {
        actionNumber: actionNumber ? actionNumber.trim() : undefined,
        reason: retentionReason.trim(),
        amountToPay: parseFloat(retentionAmount) || 0,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes ? fiscalNotes.trim() : undefined
      };
      
      console.log("Updating fiscal action with data:", fiscalActionData);
      
      // Use the updateFiscalAction function from the ShipmentsContext
      const result = await updateFiscalAction(shipmentId, fiscalActionData);
      console.log("Fiscal action update result:", result);
      
      // Close the retention sheet
      setShowRetentionSheet(false);
      
      // Show success message
      toast.success("Informações de retenção atualizadas com sucesso");
      
      // Trigger a status change to refresh the UI if needed
      if (onStatusChange) {
        onStatusChange('retained');
      }
    } catch (error) {
      console.error("Error updating retention details:", error);
      toast.error("Erro ao atualizar informações de retenção");
    }
  };

  // Handler for document selection confirmation
  const handleDocumentSelectionContinue = (documentIds: string[]) => {
    setSelectedDocumentIds(documentIds);
    setShowDocumentSelection(false);
    setShowDeliveryDialog(true);
  };
  
  // Handler for cancellation of document selection
  const handleDocumentSelectionCancel = () => {
    setSelectedDocumentIds([]);
    setShowDocumentSelection(false);
  };

  return {
    // Dialog visibility states
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
    // Document selection
    selectedDocumentIds,
    setSelectedDocumentIds,
    
    // Delivery form states
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    
    // Retention form states
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
    
    // Handlers
    handleStatusChangeClick,
    handleDeliveryConfirm,
    handleRetentionConfirm,
    handleRetentionUpdate,
    handleDocumentSelectionContinue,
    handleDocumentSelectionCancel,
    
    // Shipment ID
    shipmentId
  };
}
