
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { Shipment } from "@/types/shipment";
import { useShipmentState } from "./hooks/useShipmentState";
import { useShipmentSave } from "./hooks/useShipmentSave";
import { useShipmentDelete } from "./hooks/useShipmentDelete";
import { useShipmentStatusChange } from "../hooks/useShipmentStatusChange";
import { useStatusDisplay } from "../hooks/status/useStatusDisplay";
import { useState } from "react";

export function useShipmentDetails(shipment: Shipment, onClose: () => void) {
  // New state to track if we're editing retention details
  const [isEditing, setIsEditing] = useState(false);
  
  // Get base functions from context
  const { updateDocument } = useShipments();
  const { addDelivery } = useDeliveries();

  // Use the state management hook
  const shipmentState = useShipmentState(shipment);

  // Use the save functionality
  const { handleSave: saveHandler } = useShipmentSave(shipment);

  // Use the delete functionality
  const { handleDelete: deleteHandler } = useShipmentDelete();

  // Use the status display hook
  const { getStatusLabel } = useStatusDisplay();

  // Use the status change hook
  const { handleStatusChange } = useShipmentStatusChange(
    shipment,
    shipmentState.setStatus,
    shipmentState.setRetentionReason,
    shipmentState.setRetentionAmount,
    shipmentState.setPaymentDate,
    shipmentState.setReleaseDate,
    shipmentState.setActionNumber,
    shipmentState.setFiscalNotes,
    shipmentState.setReceiverName,
    shipmentState.setDeliveryDate,
    shipmentState.setDeliveryTime
  );

  // Handler for edit button click
  const handleEditClick = () => {
    setIsEditing(true);
    console.log("Opening retention edit form");
  };
  
  // Handler for cancel button click
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Create wrapper functions to integrate the hooks
  const handleSave = async () => {
    // Save the whole shipment
    const success = await saveHandler({
      companyId: shipmentState.companyId,
      companyName: shipmentState.companyName,
      transportMode: shipmentState.transportMode,
      carrierName: shipmentState.carrierName,
      trackingNumber: shipmentState.trackingNumber,
      packages: shipmentState.packages,
      weight: shipmentState.weight,
      arrivalFlight: shipmentState.arrivalFlight,
      arrivalDate: shipmentState.arrivalDate,
      status: shipmentState.status,
      observations: shipmentState.observations,
      deliveryDate: shipmentState.deliveryDate,
      deliveryTime: shipmentState.deliveryTime,
      receiverName: shipmentState.receiverName,
      retentionReason: shipmentState.retentionReason,
      retentionAmount: shipmentState.retentionAmount,
      paymentDate: shipmentState.paymentDate,
      releaseDate: shipmentState.releaseDate,
      actionNumber: shipmentState.actionNumber,
      fiscalNotes: shipmentState.fiscalNotes
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await deleteHandler(shipment.id, onClose, shipmentState.setDeleteAlertOpen);
  };

  return {
    isEditing,
    setIsEditing,
    ...shipmentState,
    handleSave,
    handleDelete,
    handleStatusChange,
    handleEditClick,
    handleCancelEdit,
    getStatusLabel,
    updateDocument,
    addDelivery
  };
}
