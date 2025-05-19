
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { Shipment } from "@/types/shipment";
import { useShipmentState } from "./hooks/useShipmentState";
import { useShipmentSave } from "./hooks/useShipmentSave";
import { useShipmentDelete } from "./hooks/useShipmentDelete";
import { useShipmentStatusChange } from "../hooks/useShipmentStatusChange";
import { useStatusDisplay } from "../hooks/status/useStatusDisplay";
import { useState } from "react";
import { toast } from "sonner";

export function useShipmentDetails(shipment: Shipment, onClose: () => void) {
  // New state to track if we're editing retention details
  const [isEditing, setIsEditing] = useState(false);
  
  // Get base functions from context
  const { updateDocument, updateFiscalAction } = useShipments();
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
    
    // Populate with current values
    // Opening RetentionSheet is handled in the DetailsTab component
    // through the showRetentionSheet state variable
  };
  
  // Handler for cancel button click
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  // Handler to save fiscal action details
  const handleSaveFiscalAction = async () => {
    try {
      if (!shipment.id) return;
      
      console.log("Saving fiscal action details:", {
        actionNumber: shipmentState.actionNumber,
        retentionReason: shipmentState.retentionReason,
        retentionAmount: shipmentState.retentionAmount,
        paymentDate: shipmentState.paymentDate,
        releaseDate: shipmentState.releaseDate,
        fiscalNotes: shipmentState.fiscalNotes,
      });
      
      // Update the fiscal action with the current values
      await updateFiscalAction(shipment.id, {
        actionNumber: shipmentState.actionNumber?.trim() || undefined,
        reason: shipmentState.retentionReason?.trim() || "Retenção fiscal", // Default value if empty
        amountToPay: parseFloat(shipmentState.retentionAmount || "0"),
        paymentDate: shipmentState.paymentDate || null, // Use null instead of empty string
        releaseDate: shipmentState.releaseDate || null, // Use null instead of empty string
        notes: shipmentState.fiscalNotes?.trim() || undefined,
      });
      
      toast.success("Informações de retenção atualizadas com sucesso");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving fiscal action details:", error);
      toast.error("Erro ao salvar informações de retenção");
    }
  };

  // Create wrapper functions to integrate the hooks
  const handleSave = async () => {
    // If we're editing retention details, save those
    if (isEditing && shipment.status === 'retained') {
      return handleSaveFiscalAction();
    }
    
    // Otherwise, save the whole shipment
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
