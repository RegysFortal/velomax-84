
import { useState } from 'react';
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";
import { generateMinuteNumber } from "@/utils/deliveryUtils";
import { toast } from "sonner";
import { DeliveryType, CargoType } from "@/types/delivery";

interface DeliveryConfirmProps {
  shipmentId: string;
  receiverName: string;
  deliveryDate: string;
  deliveryTime: string;
  onStatusChange?: () => void;
  resetForm: () => void;
}

/**
 * Hook for handling delivery confirmation
 */
export function useDeliveryConfirm({
  shipmentId,
  receiverName,
  deliveryDate,
  deliveryTime,
  onStatusChange,
  resetForm
}: DeliveryConfirmProps) {
  const { updateShipment, getShipmentById } = useShipments();
  const { addDelivery } = useDeliveries();

  /**
   * Confirms delivery and creates a delivery record
   */
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
      
      resetForm();
      
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error finalizing shipment:", error);
      toast.error("Erro ao finalizar embarque");
    }
  };

  return { handleDeliveryConfirm };
}
