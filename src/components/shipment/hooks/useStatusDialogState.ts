
import { useState } from 'react';

/**
 * Hook for managing status-related dialog and form state
 */
export function useStatusDialogState() {
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
  
  const resetDeliveryForm = () => {
    setReceiverName("");
    setDeliveryDate("");
    setDeliveryTime("");
    setSelectedDocumentIds([]);
  };
  
  const resetRetentionForm = () => {
    setRetentionReason("");
    setRetentionAmount("");
    setPaymentDate("");
    setReleaseDate("");
    setActionNumber("");
    setFiscalNotes("");
  };
  
  const resetAllDialogs = () => {
    setShowDocumentSelection(false);
    setShowDeliveryDialog(false);
    setShowRetentionSheet(false);
    resetDeliveryForm();
    resetRetentionForm();
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
    
    // Reset functions
    resetDeliveryForm,
    resetRetentionForm,
    resetAllDialogs
  };
}
