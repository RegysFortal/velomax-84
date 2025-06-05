
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceNumberInput } from './InvoiceNumberInput';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormActions } from './form-sections/FormActions';

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
  // Use a safe array for invoice numbers, defaulting to an empty array if undefined
  const safeInvoiceNumbers = Array.isArray(invoiceNumbers) ? invoiceNumbers : [];
  
  // Log the current invoice numbers for debugging
  useEffect(() => {
    console.log("DocumentForm - Current invoice numbers:", safeInvoiceNumbers);
  }, [safeInvoiceNumbers]);

  const handleInvoiceNumbersChange = (newInvoiceNumbers: string[]) => {
    console.log("Setting invoice numbers to:", newInvoiceNumbers);
    setInvoiceNumbers(newInvoiceNumbers);
  };

  // Função de submit explícita para garantir que o evento seja processado corretamente
  const handleSubmit = () => {
    console.log("DocumentForm - Submit button clicked");
    onSubmit();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {editingDocument ? "Editar Documento" : "Adicionar Documento"}
      </h3>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
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
              value={safeInvoiceNumbers}
              onChange={handleInvoiceNumbersChange}
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
        </div>
      </ScrollArea>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">Cancelar</Button>
        <Button onClick={handleSubmit} type="button">Salvar</Button>
      </div>
    </div>
  );
}
