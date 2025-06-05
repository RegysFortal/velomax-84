
import React from 'react';
import { Document, DocumentStatus } from "@/types/shipment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentStatusSelectorProps {
  document: Document;
  onStatusChange: (status: DocumentStatus) => void;
}

export function DocumentStatusSelector({ document, onStatusChange }: DocumentStatusSelectorProps) {
  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in_transit', label: 'Em Trânsito' },
    { value: 'picked_up', label: 'Retirado' },
    { value: 'retained', label: 'Retido' },
    { value: 'delivered', label: 'Entregue' },
  ];

  return (
    <Select 
      value={document.status || 'in_transit'} 
      onValueChange={(value) => onStatusChange(value as DocumentStatus)}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
