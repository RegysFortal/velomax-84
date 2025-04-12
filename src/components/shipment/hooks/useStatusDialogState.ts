
import { useState } from 'react';

/**
 * Hook that manages the state of status-related dialogs and forms
 */
export function useStatusDialogState() {
  // Dialog visibility state
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  
  // Selected documents for delivery
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  
  // Form state for delivery dialog
  const [receiverName, setReceiverName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  
  // Form state for retention sheet
  const [retentionReason, setRetentionReason] = useState('');
  const [retentionAmount, setRetentionAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [actionNumber, setActionNumber] = useState('');
  const [fiscalNotes, setFiscalNotes] = useState('');
  
  /**
   * Resets the delivery form state
   */
  const resetDeliveryForm = () => {
    setReceiverName('');
    setDeliveryDate('');
    setDeliveryTime('');
    setShowDeliveryDialog(false);
    setSelectedDocumentIds([]);
  };
  
  /**
   * Resets the retention form state
   */
  const resetRetentionForm = () => {
    setRetentionReason('');
    setRetentionAmount('');
    setPaymentDate('');
    setReleaseDate('');
    setActionNumber('');
    setFiscalNotes('');
    setShowRetentionSheet(false);
  };
  
  /**
   * Resets all dialog states
   */
  const resetAllDialogs = () => {
    resetDeliveryForm();
    resetRetentionForm();
    setShowDocumentSelection(false);
  };
  
  return {
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet, 
    setShowRetentionSheet,
    selectedDocumentIds,
    setSelectedDocumentIds,
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
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
    resetDeliveryForm,
    resetRetentionForm,
    resetAllDialogs
  };
}
