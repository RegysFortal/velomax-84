
import { useState } from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";

interface StatusActionHookProps {
  status: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

export interface DeliveryDetailsType {
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  retentionReason?: string;
  retentionAmount?: string;
  paymentDate?: string;
  releaseDate?: string;
  actionNumber?: string;
  fiscalNotes?: string;
}

export function useStatusAction({ status, onStatusChange }: StatusActionHookProps) {
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [actionNumber, setActionNumber] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");

  const handleStatusChangeClick = (newStatus: ShipmentStatus) => {
    console.log(`Status button clicked for: ${newStatus}`);
    
    if (newStatus === "delivered_final") {
      setShowDeliveryDialog(true);
    } else if (newStatus === "retained") {
      setShowRetentionSheet(true);
    } else {
      // For in_transit, delivered, and partial_delivery statuses, update directly
      onStatusChange(newStatus);
    }
  };

  const handleDeliveryConfirm = () => {
    if (!receiverName.trim()) {
      toast.error("Por favor, informe o nome do recebedor");
      return;
    }

    if (!deliveryDate) {
      toast.error("Por favor, selecione a data de entrega");
      return;
    }

    if (!deliveryTime.trim()) {
      toast.error("Por favor, informe o horário da entrega");
      return;
    }

    console.log("Submitting delivery details:", {
      receiverName,
      deliveryDate,
      deliveryTime
    });

    onStatusChange("delivered_final", {
      receiverName,
      deliveryDate,
      deliveryTime
    });

    setShowDeliveryDialog(false);
    setReceiverName("");
    setDeliveryDate("");
    setDeliveryTime("");
  };
  
  const handleRetentionConfirm = () => {
    if (!retentionReason.trim()) {
      toast.error("Por favor, informe o motivo da retenção");
      return;
    }

    console.log("Submitting retention details:", {
      retentionReason,
      retentionAmount,
      paymentDate,
      releaseDate
    });

    onStatusChange("retained", {
      receiverName: "",
      deliveryDate: "",
      deliveryTime: "",
      retentionReason,
      retentionAmount,
      paymentDate,
      releaseDate,
      actionNumber,
      fiscalNotes
    });

    setShowRetentionSheet(false);
    setRetentionReason("");
    setRetentionAmount("");
    setPaymentDate("");
    setReleaseDate("");
    setActionNumber("");
    setFiscalNotes("");
  };

  return {
    // Dialog state
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
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
