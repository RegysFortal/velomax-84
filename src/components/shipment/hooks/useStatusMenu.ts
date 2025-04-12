
import { useState } from 'react';
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";
import { ShipmentStatus } from "@/types/shipment";
import { DeliveryType, CargoType } from "@/types/delivery";
import { generateMinuteNumber } from "@/utils/deliveryUtils";
import { toast } from "sonner";

interface StatusMenuHookProps {
  shipmentId: string;
  status: ShipmentStatus;
  onStatusChange?: () => void;
}

export function useStatusMenu({ shipmentId, status, onStatusChange }: StatusMenuHookProps) {
  const { updateStatus, updateShipment, updateFiscalAction, getShipmentById } = useShipments();
  const { addDelivery } = useDeliveries();
  
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

  const getStatusLabel = (statusValue: ShipmentStatus): string => {
    switch (statusValue) {
      case "in_transit": return "Em Trânsito";
      case "retained": return "Retida";
      case "delivered": return "Retirada";
      case "delivered_final": return "Entregue";
      default: return statusValue;
    }
  };

  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    if (newStatus === status) return;
    
    try {
      console.log(`Attempting to change status to: ${newStatus}`);
      
      if (newStatus === "delivered_final") {
        setShowDeliveryDialog(true);
        return;
      } else if (newStatus === "retained") {
        setShowRetentionSheet(true);
        return;
      }
      
      // For other statuses (in_transit and delivered), update directly
      const updatedShipment = await updateStatus(shipmentId, newStatus);
      
      if (updatedShipment) {
        await updateShipment(shipmentId, { 
          status: newStatus,
          isRetained: newStatus === "retained"
        });
        
        toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
        
        // Convert all status values to string literals for safe comparison
        const statusString = String(status) as string;
        const newStatusString = String(newStatus) as string;
        const updatedStatusString = String(updatedShipment.status) as string;
        
        const isRetained = 
          statusString === "retained" || 
          newStatusString === "retained" || 
          updatedStatusString === "retained";
        
        if (isRetained) {
          await updateFiscalAction(shipmentId, null);
        }
        
        if (onStatusChange) onStatusChange();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao alterar status");
    }
  };

  const handleDeliveryConfirm = async () => {
    try {
      // Get the shipment details to create the delivery
      const shipment = getShipmentById(shipmentId);
      if (!shipment) {
        toast.error("Embarque não encontrado");
        return;
      }

      // Update the shipment status
      await updateShipment(shipmentId, {
        status: "delivered_final",
        receiverName,
        deliveryDate,
        deliveryTime,
        isRetained: false
      });
      
      // Create a delivery from this shipment
      const newDelivery = {
        minuteNumber: generateMinuteNumber([]), // Generate a new minute number
        clientId: shipment.companyId, // Use the company ID as client ID
        deliveryDate,
        deliveryTime,
        receiver: receiverName,
        weight: shipment.weight,
        packages: shipment.packages,
        deliveryType: "standard" as DeliveryType, // Explicitly cast to DeliveryType
        cargoType: "standard" as CargoType, // Explicitly cast to CargoType
        cargoValue: 0, // Default cargo value
        totalFreight: 0, // Default freight
        notes: `Gerado automaticamente do embarque ${shipment.trackingNumber}`
      };

      // Add the delivery
      await addDelivery(newDelivery);
      
      toast.success("Embarque finalizado e entrega registrada com sucesso");
      
      setShowDeliveryDialog(false);
      setReceiverName("");
      setDeliveryDate("");
      setDeliveryTime("");
      
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error finalizing shipment:", error);
      toast.error("Erro ao finalizar embarque");
    }
  };

  const handleRetentionConfirm = async () => {
    try {
      console.log("Setting status to retained and updating fiscal action");
      
      // First update the status
      await updateStatus(shipmentId, "retained");
      
      // Then update the shipment details and mark as retained
      await updateShipment(shipmentId, { 
        status: "retained",
        isRetained: true 
      });
      
      // Then create/update the fiscal action
      const retentionAmountValue = parseFloat(retentionAmount || "0");
      
      await updateFiscalAction(shipmentId, {
        actionNumber: actionNumber.trim() || undefined,
        reason: retentionReason.trim(),
        amountToPay: retentionAmountValue,
        paymentDate: paymentDate || undefined,
        releaseDate: releaseDate || undefined,
        notes: fiscalNotes.trim() || undefined,
      });
      
      toast.success("Status alterado para Retida e informações de retenção atualizadas");
      
      setShowRetentionSheet(false);
      setRetentionReason("");
      setRetentionAmount("");
      setPaymentDate("");
      setReleaseDate("");
      setActionNumber("");
      setFiscalNotes("");
      
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error setting retention status:", error);
      toast.error("Erro ao definir status de retenção");
    }
  };

  return {
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
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
    handleStatusChange,
    handleDeliveryConfirm,
    handleRetentionConfirm,
    getStatusLabel
  };
}
