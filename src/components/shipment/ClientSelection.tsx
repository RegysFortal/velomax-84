
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
  const { clients, loading } = useClients();
  
  // Prevent select from being interactive while clients are loading
  const isDisabled = disabled || loading;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="client">Cliente</Label>
      <Select 
        value={companyId} 
        onValueChange={onCompanyChange}
        disabled={isDisabled}
      >
        <SelectTrigger id="client" className="w-full">
          <SelectValue placeholder={loading ? "Carregando clientes..." : "Selecione o cliente"} />
        </SelectTrigger>
        <SelectContent>
          {clients.length === 0 && (
            <SelectItem value="no-clients" disabled>
              Nenhum cliente encontrado
            </SelectItem>
          )}
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
