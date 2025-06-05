
import { useState } from 'react';
import { Document } from '@/types/shipment';

/**
 * Hook for managing document form state
 */
export function useDocumentForm() {
  const [minuteNumber, setMinuteNumber] = useState('');
  const [invoiceNumbers, setInvoiceNumbers] = useState<string[]>([]);
  const [packages, setPackages] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [isDelivered, setIsDelivered] = useState(false);

  const resetForm = () => {
    setMinuteNumber('');
    setInvoiceNumbers([]);
    setPackages('');
    setWeight('');
    setNotes('');
    setIsDelivered(false);
  };

  const populateForm = (document: Document) => {
    setMinuteNumber(document.minuteNumber || '');
    setInvoiceNumbers(document.invoiceNumbers || []);
    setPackages(document.packages?.toString() || '');
    setWeight(document.weight?.toString() || '');
    setNotes(document.notes || '');
    // Don't set isDelivered - this is controlled by status change
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
    resetForm,
    populateForm
  };
}
