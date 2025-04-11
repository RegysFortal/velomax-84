
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentFormProps {
  editingDocument: boolean;
  name: string;
  setName: (value: string) => void;
  minuteNumber: string;
  setMinuteNumber: (value: string) => void;
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
  name,
  setName,
  minuteNumber,
  setMinuteNumber,
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
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingDocument ? "Editar Documento" : "Adicionar Documento"}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Nome do Documento</label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Nota Fiscal 12345"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="minuteNumber" className="text-sm font-medium">Número da Minuta</label>
            <Input 
              id="minuteNumber"
              value={minuteNumber}
              onChange={(e) => setMinuteNumber(e.target.value)}
              placeholder="Ex: MIN12345"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="packages" className="text-sm font-medium">Volumes</label>
              <Input 
                id="packages"
                type="number"
                value={packages}
                onChange={(e) => setPackages(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">Peso (kg)</label>
              <Input 
                id="weight"
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Observações</label>
            <Textarea 
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o documento"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="isDelivered" 
              checked={isDelivered}
              onChange={(e) => setIsDelivered(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="isDelivered" className="text-sm font-medium">
              Marcar como entregue
            </label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {editingDocument ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
