
import { useState } from 'react';
import { Document } from '@/types/shipment';

/**
 * Hook for managing document form state
 */
export function useDocumentFormState(editingDocument: Document | null) {
  // Form state
  const [minuteNumber, setMinuteNumber] = useState('');
  const [invoiceNumbers, setInvoiceNumbers] = useState<string[]>([]);
  const [packages, setPackages] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [isDelivered, setIsDelivered] = useState(false);
  
  // Load document data when editing
  const loadDocumentData = (document: Document) => {
    setMinuteNumber(document.minuteNumber || '');
    // Ensure invoiceNumbers is always an array
    setInvoiceNumbers(Array.isArray(document.invoiceNumbers) ? [...document.invoiceNumbers] : []);
    setPackages(document.packages !== undefined ? String(document.packages) : '');
    setWeight(document.weight !== undefined ? String(document.weight) : '');
    setNotes(document.notes || '');
    setIsDelivered(document.isDelivered || false);
  };

  // Reset form data
  const resetFormData = () => {
    setMinuteNumber('');
    setInvoiceNumbers([]);
    setPackages('');
    setWeight('');
    setNotes('');
    setIsDelivered(false);
  };

  return {
    minuteNumber,
    setMinuteNumber,
    invoiceNumbers,
    setInvoiceNumbers,
    packages,
    setPackages,
    weight,
    setWeight,
    notes,
    setNotes,
    isDelivered,
    setIsDelivered,
    loadDocumentData,
    resetFormData
  };
}
