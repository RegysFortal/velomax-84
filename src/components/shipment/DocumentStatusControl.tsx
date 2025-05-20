
import React from 'react';
import { Check, Package, AlertTriangle, Truck, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { Document, DocumentStatus } from "@/types/shipment";
import { RetentionSheet } from "./dialogs/RetentionSheet";
import { useDocumentRetention } from "./hooks/useDocumentRetention";

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
  // Get shipment context for document updates
  const { getShipmentById, updateDocument } = useShipments();
  
  // Use the document retention hook
  const { 
    retentionState,
    handleRetentionConfirm
  } = useDocumentRetention(shipmentId, document.id, onStatusChange);
  
  const getStatusBadge = () => {
    if (document.isRetained) {
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          Retido
        </Badge>
      );
    } else if (document.isPickedUp) {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          Retirado
        </Badge>
      );
    } else if (document.isDelivered) {
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
  
  const handleStatusChange = async (status: DocumentStatus) => {
    try {
      console.log(`Changing document status to: ${status}`, document.id);
      
      // Se estamos mudando para status retido, mostrar o formulário de retenção primeiro
      if (status === "retained") {
        retentionState.setShowRetentionSheet(true);
        return;
      }
      
      // Obter os documentos atuais para este embarque
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment || !shipment.documents) {
        toast.error("Não foi possível encontrar os documentos do embarque");
        return;
      }
      
      // Criar lista de documentos atualizada
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === document.id) {
          // Usar uma abordagem mais explícita para evitar problemas de comparação de tipos
          const isDelivered = status === "delivered";
          const isRetained = status === "retained";
          const isPickedUp = status === "picked_up";
          
          return {
            ...doc,
            isDelivered,
            isRetained,
            isPickedUp
          };
        }
        return doc;
      });
      
      // Atualizar o documento
      await updateDocument(shipmentId, document.id, updatedDocuments);
      
      // Mostrar mensagem de sucesso
      let statusText = "Pendente";
      if (status === "delivered") statusText = "Entregue";
      else if (status === "retained") statusText = "Retido";
      else if (status === "picked_up") statusText = "Retirado";
      
      toast.success(`Documento marcado como ${statusText}`);
      
      // Chamar o callback se fornecido
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Erro ao atualizar status do documento");
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            {getStatusBadge()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Pendente</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("retained")}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Retido</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("picked_up")}>
            <Truck className="mr-2 h-4 w-4" />
            <span>Retirado</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("delivered")}>
            <Check className="mr-2 h-4 w-4" />
            <span>Entregue</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <RetentionSheet
        open={retentionState.showRetentionSheet}
        onOpenChange={retentionState.setShowRetentionSheet}
        actionNumber={retentionState.actionNumber}
        setActionNumber={retentionState.setActionNumber}
        retentionReason={retentionState.retentionReason}
        setRetentionReason={retentionState.setRetentionReason}
        retentionAmount={retentionState.retentionAmount}
        setRetentionAmount={retentionState.setRetentionAmount}
        paymentDate={retentionState.paymentDate}
        setPaymentDate={retentionState.setPaymentDate}
        releaseDate={retentionState.releaseDate}
        setReleaseDate={retentionState.setReleaseDate}
        fiscalNotes={retentionState.fiscalNotes}
        setFiscalNotes={retentionState.setFiscalNotes}
        onConfirm={handleRetentionConfirm}
        isEditing={false}
      />
    </>
  );
}
