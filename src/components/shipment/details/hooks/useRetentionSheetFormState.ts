
import { useState } from "react";

/**
 * Hook to manage the form state for retention sheet
 */
export const useRetentionSheetFormState = (
  initialActionNumber: string,
  initialRetentionReason: string,
  initialRetentionAmount: string,
  initialPaymentDate: string,
  initialReleaseDate: string,
  initialFiscalNotes: string
) => {
  // Form state for retention details
  const [actionNumber, setActionNumber] = useState(initialActionNumber || '');
  const [retentionReason, setRetentionReason] = useState(initialRetentionReason || '');
  const [retentionAmount, setRetentionAmount] = useState(initialRetentionAmount || '');
  const [paymentDate, setPaymentDate] = useState(initialPaymentDate || '');
  const [releaseDate, setReleaseDate] = useState(initialReleaseDate || '');
  const [fiscalNotes, setFiscalNotes] = useState(initialFiscalNotes || '');
  
  // UI state
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset all form fields to their initial values
   */
  const resetFormFields = () => {
    setActionNumber(initialActionNumber || '');
    setRetentionReason(initialRetentionReason || '');
    setRetentionAmount(initialRetentionAmount || '');
    setPaymentDate(initialPaymentDate || '');
    setReleaseDate(initialReleaseDate || '');
    setFiscalNotes(initialFiscalNotes || '');
  };

  /**
   * Update all form fields with new values
   */
  const updateFormFields = (
    newActionNumber: string,
    newReason: string,
    newAmount: string,
    newPaymentDate: string,
    newReleaseDate: string,
    newNotes: string
  ) => {
    setActionNumber(newActionNumber || '');
    setRetentionReason(newReason || '');
    setRetentionAmount(newAmount || '');
    setPaymentDate(newPaymentDate || '');
    setReleaseDate(newReleaseDate || '');
    setFiscalNotes(newNotes || '');
  };

  return {
    // Form state
    actionNumber,
    setActionNumber,
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    releaseDate,
    setReleaseDate,
    fiscalNotes,
    setFiscalNotes,
    
    // UI state
    showRetentionSheet,
    setShowRetentionSheet,
    isSubmitting,
    setIsSubmitting,
    
    // Methods
    resetFormFields,
    updateFormFields
  };
};
