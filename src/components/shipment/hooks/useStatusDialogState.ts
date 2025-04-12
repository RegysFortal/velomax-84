
import { useState } from 'react';

/**
 * Hook that manages the state for delivery and retention dialogs
 */
export function useStatusDialogState() {
  // Dialog state
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
    
    // Reset functions
    resetDeliveryForm,
    resetRetentionForm
  };
}
