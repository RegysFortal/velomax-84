
import { useState } from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { useStatusLabel } from './useStatusLabel';
import { useStatusChange } from './useStatusChange';
import { useDeliveryConfirm } from './useDeliveryConfirm';
import { useRetentionConfirm } from './useRetentionConfirm';

interface StatusMenuHookProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange?: () => void;
}

/**
 * Main hook that combines all status-related functionality
 */
export function useStatusMenu({ shipmentId, status, onStatusChange }: StatusMenuHookProps) {
  // State for dialogs and forms
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  
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

  // Reset form functions
  const resetDeliveryForm = () => {
    setShowDeliveryDialog(false);
    setReceiverName("");
    setDeliveryDate("");
    setDeliveryTime("");
  };

  const resetRetentionForm = () => {
    setShowRetentionSheet(false);
    setRetentionReason("");
    setRetentionAmount("");
    setPaymentDate("");
    setReleaseDate("");
    setActionNumber("");
    setFiscalNotes("");
  };

  // Import functionality from separate hooks
  const { getStatusLabel } = useStatusLabel();
  
  const { handleStatusChange } = useStatusChange({ 
    shipmentId, 
    status, 
    onStatusChange,
    setShowDeliveryDialog,
    setShowRetentionSheet
  });
  
  const { handleDeliveryConfirm } = useDeliveryConfirm({
    shipmentId,
    receiverName,
    deliveryDate,
    deliveryTime,
    onStatusChange,
    resetForm: resetDeliveryForm
  });
  
  const { handleRetentionConfirm } = useRetentionConfirm({
    shipmentId,
    retentionReason,
    retentionAmount,
    paymentDate,
    releaseDate,
    actionNumber,
    fiscalNotes,
    onStatusChange,
    resetForm: resetRetentionForm
  });

  return {
    // Dialog state
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
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
