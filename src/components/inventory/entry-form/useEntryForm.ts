
import { useState } from 'react';
import { StockEntry } from '@/types/inventory';
import { toast } from 'sonner';

interface UseEntryFormProps {
  entry?: StockEntry;
  onSave: (entry: Omit<StockEntry, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export function useEntryForm({ entry, onSave, onClose }: UseEntryFormProps) {
  const [formData, setFormData] = useState<Omit<StockEntry, 'id' | 'createdAt'>>({
    date: entry?.date || new Date().toISOString().split('T')[0],
    productId: entry?.productId || '',
    productName: entry?.productName || '',
    quantity: entry?.quantity || 1,
    invoiceNumber: entry?.invoiceNumber || '',
    supplier: entry?.supplier || '',
    unitPrice: entry?.unitPrice || 0,
    totalPrice: entry?.totalPrice || 0,
    transportDocument: entry?.transportDocument || '',
    receivedBy: entry?.receivedBy || '',
    observations: entry?.observations || '',
  });

  const handleFormDataChange = (data: Omit<StockEntry, 'id' | 'createdAt'>) => {
    setFormData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.date || !formData.quantity || !formData.invoiceNumber) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSave(formData);
    onClose();
  };

  return {
    formData,
    handleFormDataChange,
    handleSubmit
  };
}
