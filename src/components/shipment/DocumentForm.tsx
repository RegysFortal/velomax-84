
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DialogFooter, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

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
  onSubmit: (e: React.FormEvent) => void;
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
  const [newInvoiceNumber, setNewInvoiceNumber] = useState("");
  
  const handleAddInvoiceNumber = () => {
    if (newInvoiceNumber.trim()) {
      setInvoiceNumbers([...invoiceNumbers, newInvoiceNumber.trim()]);
      setNewInvoiceNumber("");
    }
  };
  
  const handleRemoveInvoiceNumber = (index: number) => {
    const updatedInvoiceNumbers = [...invoiceNumbers];
    updatedInvoiceNumbers.splice(index, 1);
    setInvoiceNumbers(updatedInvoiceNumbers);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{editingDocument ? 'Editar Documento' : 'Adicionar Documento'}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minuteNumber">Número da Minuta</Label>
            <Input
              id="minuteNumber"
              value={minuteNumber}
              onChange={(e) => setMinuteNumber(e.target.value)}
              placeholder="Número da minuta"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Números das Notas Fiscais</Label>
            <div className="space-y-2">
              {invoiceNumbers.map((invoiceNumber, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={invoiceNumber}
                    readOnly
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveInvoiceNumber(index)}
                    className="h-10 w-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input
                  id="invoiceNumber"
                  value={newInvoiceNumber}
                  onChange={(e) => setNewInvoiceNumber(e.target.value)}
                  placeholder="Adicionar número de nota fiscal"
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleAddInvoiceNumber}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packages">Volumes</Label>
              <Input
                id="packages"
                type="number"
                value={packages}
                onChange={(e) => setPackages(e.target.value)}
                placeholder="Quantidade de volumes"
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
                placeholder="Peso em kg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o documento"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isDelivered"
              checked={isDelivered}
              onCheckedChange={setIsDelivered}
            />
            <Label htmlFor="isDelivered">Documento entregue</Label>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {editingDocument ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogFooter>
    </form>
  );
}
