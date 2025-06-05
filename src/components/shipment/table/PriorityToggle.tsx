
import React from 'react';
import { Document } from "@/types/shipment";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

interface PriorityToggleProps {
  document: Document;
  shipmentId: string;
  onUpdate: () => void;
}

export function PriorityToggle({ document, shipmentId, onUpdate }: PriorityToggleProps) {
  const { updateDocument, getShipmentById } = useShipments();
  
  const handleTogglePriority = async () => {
    try {
      const shipment = getShipmentById(shipmentId);
      if (!shipment || !shipment.documents) return;
      
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === document.id) {
          return { ...doc, isPriority: !doc.isPriority };
        }
        return doc;
      });
      
      await updateDocument(shipmentId, document.id, updatedDocuments);
      
      if (!document.isPriority) {
        toast.success("Documento marcado como prioritário");
        // Aqui seria enviada a notificação para o painel principal
      } else {
        toast.success("Prioridade removida do documento");
      }
      
      onUpdate();
    } catch (error) {
      console.error("Error toggling priority:", error);
      toast.error("Erro ao alterar a prioridade do documento");
    }
  };

  return (
    <Button
      variant={document.isPriority ? "destructive" : "outline"}
      size="sm"
      onClick={handleTogglePriority}
      title={document.isPriority ? "Remover prioridade" : "Marcar como prioritário"}
    >
      <AlertTriangle className="h-4 w-4" />
      {document.isPriority && <span className="ml-1">Prioritário</span>}
    </Button>
  );
}
