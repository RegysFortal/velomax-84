
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { InvoiceNumberInput } from './InvoiceNumberInput';

interface DocumentFormProps {
  editingDocument: boolean;
  minuteNumber: string;
  setMinuteNumber: (value: string) => void;
  invoiceNumbers: string[];
  setInvoiceNumbers: (value: string[]) => void;
  packages: string;
  setPackages: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  isDelivered: boolean;
  setIsDelivered: (value: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function DocumentForm({
  editingDocument,
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
  onSubmit,
  onCancel
}: DocumentFormProps) {
  // Log the current invoice numbers for debugging
  useEffect(() => {
    console.log("DocumentForm - Current invoice numbers:", invoiceNumbers);
  }, [invoiceNumbers]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {editingDocument ? "Editar Documento" : "Adicionar Documento"}
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="minuteNumber">Número da Minuta</Label>
        <Input 
          id="minuteNumber" 
          value={minuteNumber} 
          onChange={(e) => setMinuteNumber(e.target.value)} 
          placeholder="12345"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Números de Nota Fiscal</Label>
        <InvoiceNumberInput 
          invoiceNumbers={invoiceNumbers}
          setInvoiceNumbers={setInvoiceNumbers}
        />
        <p className="text-sm text-muted-foreground">
          Pressione Enter para adicionar cada número de nota fiscal
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="packages">Volumes</Label>
          <Input 
            id="packages" 
            type="number" 
            value={packages} 
            onChange={(e) => setPackages(e.target.value)} 
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input 
            id="weight" 
            type="number" 
            step="0.01" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            placeholder="0.00"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Informações adicionais"
          rows={3}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="isDelivered" 
          checked={isDelivered} 
          onCheckedChange={setIsDelivered} 
        />
        <Label htmlFor="isDelivered">Entregue</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={onSubmit}>Salvar</Button>
      </div>
    </div>
  );
}
