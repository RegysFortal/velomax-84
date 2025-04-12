
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useClients } from "@/contexts/clients";

interface ClientSelectionProps {
  companyId: string;
  onCompanyChange: (id: string) => void;
  disabled?: boolean;
}

export function ClientSelection({ 
  companyId, 
  onCompanyChange,
  disabled = false
}: ClientSelectionProps) {
  const { clients } = useClients();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="client">Cliente</Label>
      <Select 
        value={companyId} 
        onValueChange={onCompanyChange}
        disabled={disabled}
      >
        <SelectTrigger id="client" className="w-full">
          <SelectValue placeholder="Selecione o cliente" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.tradingName || client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
