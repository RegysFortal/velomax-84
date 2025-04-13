import { useState } from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";
import { useStatusLabel } from './useStatusLabel';

export type DeliveryDetailsType = {
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  selectedDocumentIds?: string[];
};

interface UseStatusActionProps {
  status: ShipmentStatus;
  shipmentId: string;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: any) => void;
}

export function useStatusAction({ status, shipmentId, onStatusChange }: UseStatusActionProps) {
  const { getStatusLabel } = useStatusLabel();
  
  // Dialog state
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  
  // Document selection state
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  
  // Delivery form state
  const [receiverName, setReceiverName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  // Retention form state
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [actionNumber, setActionNumber] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");
  
  // Handler for status change button click
  const handleStatusChangeClick = (newStatus: ShipmentStatus) => {
    // If changing to delivered_final, show document selection
    if (newStatus === "delivered_final") {
      setShowDocumentSelection(true);
      return;
    }
    
    // If changing to "retained", show the retention sheet
    if (newStatus === "retained") {
      setShowRetentionSheet(true);
      return;
    }
    
    // Otherwise, update the status directly
    onStatusChange(newStatus);
  };
  
  // Handler for delivery confirmation
  const handleDeliveryConfirm = () => {
    try {
      // Validate form
      if (!receiverName.trim() || !deliveryDate || !deliveryTime) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      // Call onStatusChange with delivery details
      onStatusChange("delivered_final", {
        receiverName,
        deliveryDate,
        deliveryTime,
        selectedDocumentIds
      });
      
      // Close dialog
      setShowDeliveryDialog(false);
      
      // Clear state
      setSelectedDocumentIds([]);
      setReceiverName("");
      setDeliveryDate("");
      setDeliveryTime("");
    } catch (error) {
      toast.error("Erro ao finalizar entrega");
      console.error(error);
    }
  };
  
  // Handler for retention confirmation
  const handleRetentionConfirm = () => {
    try {
      // Validate form
      if (!retentionReason.trim()) {
        toast.error("Informe o motivo da retenção");
        return;
      }
      
      const amountValue = parseFloat(retentionAmount || "0");
      
      if (isNaN(amountValue) || amountValue < 0) {
        toast.error("Valor da retenção deve ser um número válido");
        return;
      }
      
      // Call onStatusChange with retention details
      onStatusChange("retained", {
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      });
      
      // Close dialog
      setShowRetentionSheet(false);
      
      // Clear state
      setRetentionReason("");
      setRetentionAmount("");
      setPaymentDate("");
      setReleaseDate("");
      setActionNumber("");
      setFiscalNotes("");
    } catch (error) {
      toast.error("Erro ao reter embarque");
      console.error(error);
    }
  };
  
  return {
    // Dialog state
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
    // Document selection state
    selectedDocumentIds,
    setSelectedDocumentIds,
    
    // Delivery form state
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    
    // Retention form state
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    releaseDate,
    setReleaseDate,
    actionNumber,
    setActionNumber,
    fiscalNotes,
    setFiscalNotes,
    
    // Action handlers
    handleStatusChangeClick,
    handleDeliveryConfirm,
    handleRetentionConfirm
  };
}
