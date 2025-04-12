
import { useState } from 'react';
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";

interface StatusActionHookProps {
  status: ShipmentStatus;
  shipmentId: string;
  onStatusChange: (status: ShipmentStatus, deliveryDetails?: DeliveryDetailsType) => void;
}

export interface DeliveryDetailsType {
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  selectedDocumentIds?: string[];
  retentionReason?: string;
  retentionAmount?: string;
  paymentDate?: string;
  releaseDate?: string;
  actionNumber?: string;
  fiscalNotes?: string;
}

export function useStatusAction({ status, shipmentId, onStatusChange }: StatusActionHookProps) {
  const { getShipmentById } = useShipments();
  const { addDelivery } = useDeliveries();
  
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
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
      // Check if the shipment has any documents
      const shipment = getShipmentById(shipmentId);
      
      if (shipment && shipment.documents && shipment.documents.length > 0) {
        // Check if there are any undelivered documents
        const undeliveredDocs = shipment.documents.filter(doc => !doc.isDelivered);
        
        if (undeliveredDocs.length > 0) {
          // If there are undelivered documents, show document selection first
          setShowDocumentSelection(true);
          return;
        }
      }
      
      // If no documents or all already delivered, proceed directly to delivery dialog
      setShowDeliveryDialog(true);
    } else if (newStatus === "retained") {
      setShowRetentionSheet(true);
    } else {
      // For in_transit and delivered statuses, update directly
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
      deliveryTime,
      selectedDocumentIds
    });

    onStatusChange("delivered_final", {
      receiverName,
      deliveryDate,
      deliveryTime,
      selectedDocumentIds
    });

    setShowDeliveryDialog(false);
    resetDeliveryForm();
  };
  
  const resetDeliveryForm = () => {
    setReceiverName("");
    setDeliveryDate("");
    setDeliveryTime("");
    setSelectedDocumentIds([]);
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
    resetRetentionForm();
  };
  
  const resetRetentionForm = () => {
    setRetentionReason("");
    setRetentionAmount("");
    setPaymentDate("");
    setReleaseDate("");
    setActionNumber("");
    setFiscalNotes("");
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
    handleRetentionConfirm,
    resetDeliveryForm,
    resetRetentionForm
  };
}
