import { useState } from 'react';
import { ShipmentStatus } from "@/types/shipment";

export type DeliveryDetailsType = {
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  selectedDocumentIds?: string[];
};

interface UseStatusActionProps {
  status: ShipmentStatus;
  shipmentId: string;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

export function useStatusAction({ status, shipmentId, onStatusChange }: UseStatusActionProps) {
  // Dialog visibility states
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  
  // Selected document IDs for partial delivery
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  
  // Form states for different dialogs
  const [receiverName, setReceiverName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  
  // Retention form states
  const [retentionReason, setRetentionReason] = useState('');
  const [retentionAmount, setRetentionAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [actionNumber, setActionNumber] = useState('');
  const [fiscalNotes, setFiscalNotes] = useState('');
  
  // Handler for clicking a status change button
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
  
  return {
    // Dialog states
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
    // Selected documents
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
    handleRetentionConfirm
  };
}
