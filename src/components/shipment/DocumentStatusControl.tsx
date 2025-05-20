
import React from 'react';
import { Check, Package, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { Document } from "@/types/shipment";

interface DocumentStatusControlProps {
  shipmentId: string;
  document: Document;
  onStatusChange?: () => void;
}

export function DocumentStatusControl({ 
  shipmentId, 
  document, 
  onStatusChange 
}: DocumentStatusControlProps) {
  const { updateDocument } = useShipments();
  
  const getStatusBadge = () => {
    if (document.isDelivered) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          Entregue
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          Pendente
        </Badge>
      );
    }
  };
  
  const handleStatusChange = async (status: 'retained' | 'delivered' | 'pending') => {
    try {
      console.log(`Changing document status to: ${status}`, document.id);
      
      // Get the current documents for this shipment
      const { getShipmentById } = useShipments();
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment || !shipment.documents) {
        toast.error("Não foi possível encontrar os documentos do embarque");
        return;
      }
      
      // Create updated document list
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === document.id) {
          return {
            ...doc,
            isDelivered: status === 'delivered',
            // If we want to track retained status separately, we could add a new field here
          };
        }
        return doc;
      });
      
      // Update the document
      await updateDocument(shipmentId, document.id, updatedDocuments);
      
      // Show success message
      toast.success(`Documento marcado como ${status === 'delivered' ? 'Entregue' : status === 'retained' ? 'Retido' : 'Pendente'}`);
      
      // Call the callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Erro ao atualizar status do documento");
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          {getStatusBadge()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
          <Package className="mr-2 h-4 w-4" />
          <span>Pendente</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('retained')}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          <span>Retido</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('delivered')}>
          <Check className="mr-2 h-4 w-4" />
          <span>Entregue</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
