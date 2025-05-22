
import React, { useState } from 'react';
import { Check, Package, AlertTriangle, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { Document, DocumentStatus, ShipmentStatus } from "@/types/shipment";
import { RetentionSheet } from "./dialogs/RetentionSheet";
import { useDocumentRetention } from "./hooks/useDocumentRetention";
import { DeliveryDialog } from "./dialogs/DeliveryDialog";

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
  const { getShipmentById, updateDocument, updateStatus } = useShipments();
  
  // Use the document retention hook
  const { 
    retentionState,
    handleRetentionConfirm
  } = useDocumentRetention(shipmentId, document.id, onStatusChange);

  // State for delivery dialog
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
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
      
      // If changing to retained status, show retention form first
      if (status === "retained") {
        retentionState.setShowRetentionSheet(true);
        return;
      }
      
      // If changing to delivered status, show delivery form first
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

  // Handle delivery dialog confirmation
  const handleDeliveryConfirm = async () => {
    try {
      await updateDocumentStatus("delivered", {
        receiverName,
        deliveryDate,
        deliveryTime
      });
      setShowDeliveryDialog(false);
      resetDeliveryForm();
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Erro ao confirmar entrega");
    }
  };

  // Reset delivery form fields
  const resetDeliveryForm = () => {
    setReceiverName("");
    setDeliveryDate("");
    setDeliveryTime("");
  };

  // Helper function to update document status
  const updateDocumentStatus = async (status: DocumentStatus, deliveryDetails?: any) => {
    // Get current documents for this shipment
    const shipment = getShipmentById(shipmentId);
    
    if (!shipment || !shipment.documents) {
      toast.error("Não foi possível encontrar os documentos do embarque");
      return;
    }
    
    // Create updated documents list
    const updatedDocuments = shipment.documents.map(doc => {
      if (doc.id === document.id) {
        // Set boolean flags based on the status
        const isDelivered = status === "delivered";
        const isRetained = status === "retained";
        const isPickedUp = status === "picked_up";
        
        // Handle retention info based on status changes
        let retentionInfo = doc.retentionInfo;
        
        // If changing away from retained status, remove retention info
        if (doc.isRetained && status !== "retained") {
          retentionInfo = undefined;
        }
        
        // Prepare base updated document
        const updatedDoc = {
          ...doc,
          isDelivered,
          isRetained,
          isPickedUp,
          retentionInfo
        };
        
        return updatedDoc;
      }
      return doc;
    });
    
    // Update the document
    await updateDocument(shipmentId, document.id, updatedDocuments);
    
    // If we have delivery details, update the shipment with delivery information
    if (status === "delivered" && deliveryDetails) {
      await updateStatus(shipmentId, "delivered_final");
      
      // Update shipment with delivery information
      await updateShipmentWithDeliveryInfo(shipmentId, deliveryDetails);
    } else {
      // Update shipment status based on document status changes
      let shipmentStatus: ShipmentStatus | undefined;
      if (status === "delivered") {
        const allDelivered = updatedDocuments.every(doc => doc.isDelivered);
        shipmentStatus = allDelivered ? "delivered_final" : "partially_delivered";
      } else if (status === "retained") {
        shipmentStatus = "retained";
      } else if (status === "picked_up") {
        shipmentStatus = "delivered"; // Map to "Retirado" status for shipment
      }
      
      if (shipmentStatus) {
        await updateStatus(shipmentId, shipmentStatus);
      }
    }
    
    // Show success message
    let statusText = "Pendente";
    if (status === "delivered") statusText = "Entregue";
    else if (status === "picked_up") statusText = "Retirado";
    else if (status === "retained") statusText = "Retido";
    
    toast.success(`Documento marcado como ${statusText}`);
    
    // Call callback if provided
    if (onStatusChange) {
      onStatusChange();
    }
  };

  // Helper function to update shipment with delivery information
  const updateShipmentWithDeliveryInfo = async (shipmentId: string, deliveryDetails: any) => {
    try {
      const { receiverName, deliveryDate, deliveryTime } = deliveryDetails;
      // Update the shipment directly instead of the document
      const shipment = getShipmentById(shipmentId);
      if (shipment) {
        await updateStatus(shipmentId, "delivered_final", {
          receiverName,
          deliveryDate,
          deliveryTime
        });
      }
    } catch (error) {
      console.error("Error updating shipment delivery info:", error);
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
      
      {/* Retenção sheet dialog */}
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
      <DeliveryDialog
        open={showDeliveryDialog}
        onOpenChange={setShowDeliveryDialog}
        receiverName={receiverName}
        setReceiverName={setReceiverName}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
        onConfirm={handleDeliveryConfirm}
      />
    </>
  );
}
