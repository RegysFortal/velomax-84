
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

interface DocumentDeliveryFormProps {
  document: Document;
  shipmentId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export function DocumentDeliveryForm({ document, shipmentId, onClose, onUpdate }: DocumentDeliveryFormProps) {
  const { updateDocument, getShipmentById } = useShipments();
  
  const [formData, setFormData] = useState({
    deliveryDate: document.deliveryInfo?.deliveryDate || new Date().toISOString().split('T')[0],
    deliveryTime: document.deliveryInfo?.deliveryTime || new Date().toTimeString().slice(0, 5),
    receiverName: document.deliveryInfo?.receiverName || '',
    receiverId: document.deliveryInfo?.receiverId || '',
    notes: document.deliveryInfo?.notes || '',
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
            status: 'delivered' as const,
            deliveryInfo: formData,
          };
        }
        return doc;
      });
      
      await updateDocument(shipmentId, document.id, updatedDocuments);
      toast.success("Informações de entrega salvas com sucesso");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating document delivery:", error);
      toast.error("Erro ao salvar informações de entrega");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Informações de Entrega</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="deliveryDate">Data de Entrega *</Label>
            <Input
              id="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="deliveryTime">Horário de Entrega *</Label>
            <Input
              id="deliveryTime"
              type="time"
              value={formData.deliveryTime}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="receiverName">Nome do Recebedor *</Label>
            <Input
              id="receiverName"
              value={formData.receiverName}
              onChange={(e) => setFormData(prev => ({ ...prev, receiverName: e.target.value }))}
              placeholder="Nome de quem recebeu"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="receiverId">RG/CPF do Recebedor</Label>
            <Input
              id="receiverId"
              value={formData.receiverId}
              onChange={(e) => setFormData(prev => ({ ...prev, receiverId: e.target.value }))}
              placeholder="Documento do recebedor"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre a entrega"
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
