
import React, { useState } from 'react';
import { Document } from "@/types/shipment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

interface DocumentRetentionFormProps {
  document: Document;
  shipmentId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export function DocumentRetentionForm({ document, shipmentId, onClose, onUpdate }: DocumentRetentionFormProps) {
  const { updateDocument, getShipmentById } = useShipments();
  
  const [formData, setFormData] = useState({
    actionNumber: document.retentionInfo?.actionNumber || '',
    reason: document.retentionInfo?.reason || '',
    amount: document.retentionInfo?.amount || '',
    paymentDate: document.retentionInfo?.paymentDate || '',
    releaseDate: document.retentionInfo?.releaseDate || '',
    notes: document.retentionInfo?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const shipment = getShipmentById(shipmentId);
      if (!shipment || !shipment.documents) return;
      
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === document.id) {
          return {
            ...doc,
            status: 'retained' as const,
            retentionInfo: formData,
          };
        }
        return doc;
      });
      
      await updateDocument(shipmentId, document.id, updatedDocuments);
      toast.success("Informações de retenção salvas com sucesso");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating document retention:", error);
      toast.error("Erro ao salvar informações de retenção");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Informações de Retenção</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="actionNumber">Número da Ação</Label>
            <Input
              id="actionNumber"
              value={formData.actionNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, actionNumber: e.target.value }))}
              placeholder="Número da ação fiscal"
            />
          </div>
          
          <div>
            <Label htmlFor="reason">Motivo da Retenção *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Motivo da retenção"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Valor a Pagar</Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              type="number"
              step="0.01"
            />
          </div>
          
          <div>
            <Label htmlFor="paymentDate">Data de Pagamento</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="releaseDate">Data de Liberação</Label>
            <Input
              id="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações adicionais"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
