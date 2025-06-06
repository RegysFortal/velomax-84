
import React from 'react';
import { Check, Package, AlertTriangle, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentStatus } from "@/types/shipment";
import { RetentionSheet } from "./dialogs/RetentionSheet";
import { useDocumentRetention } from "./hooks/useDocumentRetention";
import { useDocumentDelivery } from "./hooks/useDocumentDelivery";
import { DocumentDeliveryDialog } from "./dialogs/DocumentDeliveryDialog";

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
  const { refreshShipmentsData } = useShipments();
  
  // Use document retention hook
  const { 
    retentionState,
    handleRetentionConfirm
  } = useDocumentRetention(shipmentId, document.id, onStatusChange);

  // Use document delivery hook
  const {
    showDeliveryDialog,
    setShowDeliveryDialog,
    receiverName,
    setReceiverName,
    receiverId,
    setReceiverId,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    arrivalKnowledgeNumber,
    setArrivalKnowledgeNumber,
    notes,
    setNotes,
    handleDeliveryConfirm,
    resetDeliveryForm
  } = useDocumentDelivery({ shipmentId, documentId: document.id, onStatusChange });
  
  const getStatusBadge = () => {
    // Verificar se documento está retido baseado no status ou flags de compatibilidade
    const isRetained = document.isRetained || (!document.isDelivered && !document.isPickedUp && document.status === 'retained');
    
    if (isRetained) {
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
      
      // If changing to retained status, show retention form
      if (status === "retained") {
        console.log("Opening retention sheet for document:", document.id);
        retentionState.setShowRetentionSheet(true);
        return;
      }
      
      // If changing to delivered status, show delivery form
      if (status === "delivered") {
        setShowDeliveryDialog(true);
        return;
      }
      
      // For other statuses, proceed with direct update
      await updateDocumentStatus(status);
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Erro ao atualizar status do documento");
    }
  };

  // Helper function to update document status directly
  const updateDocumentStatus = async (status: DocumentStatus) => {
    try {
      const isDelivered = status === "delivered";
      const isPickedUp = status === "picked_up";
      
      console.log(`Updating document ${document.id} to status: ${status}`);
      
      // Update in Supabase
      const { error } = await supabase
        .from('shipment_documents')
        .update({
          is_delivered: isDelivered,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id);

      if (error) {
        console.error("Error updating document in Supabase:", error);
        toast.error("Erro ao atualizar documento no banco de dados");
        return;
      }
      
      console.log(`Document ${document.id} updated successfully to status: ${status}`);
      
      // Show success message
      let statusText = "Pendente";
      if (status === "delivered") statusText = "Entregue";
      else if (status === "picked_up") statusText = "Retirado";
      else if (status === "retained") statusText = "Retido";
      
      toast.success(`Documento marcado como ${statusText}`);
      
      // Refresh data to update UI
      refreshShipmentsData();
      
      // Call callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Erro ao atualizar status do documento");
    }
  };

  const handleDeliveryDialogClose = (open: boolean) => {
    if (!open) {
      resetDeliveryForm();
    }
    setShowDeliveryDialog(open);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            {getStatusBadge()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-white">
          <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Pendente</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("retained")}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Retido</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("picked_up")}>
            <Package className="mr-2 h-4 w-4" />
            <span>Retirado</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("delivered")}>
            <Check className="mr-2 h-4 w-4" />
            <span>Entregue</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Retention sheet dialog */}
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

      {/* Delivery dialog */}
      <DocumentDeliveryDialog
        open={showDeliveryDialog}
        onOpenChange={handleDeliveryDialogClose}
        receiverName={receiverName}
        setReceiverName={setReceiverName}
        receiverId={receiverId}
        setReceiverId={setReceiverId}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
        arrivalKnowledgeNumber={arrivalKnowledgeNumber}
        setArrivalKnowledgeNumber={setArrivalKnowledgeNumber}
        notes={notes}
        setNotes={setNotes}
        onConfirm={handleDeliveryConfirm}
      />
    </>
  );
}
