import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { Shipment } from "@/types/shipment";
import { useShipmentState } from "./hooks/useShipmentState";
import { useShipmentSave } from "./hooks/useShipmentSave";
import { useShipmentDelete } from "./hooks/useShipmentDelete";
import { useShipmentStatusChange } from "./hooks/useShipmentStatusChange";
import { useStatusManagement } from "./hooks/useStatusManagement";
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

  // Use the status management
  const { getStatusLabel } = useStatusManagement();

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
    // Open the retention sheet with current values
    // Show a retention form dialog or sheet here
    console.log("Opening retention edit form");
    
    // We'll create a retention sheet that allows editing the retention information
    const retentionSheetData = {
      actionNumber: shipmentState.actionNumber,
      retentionReason: shipmentState.retentionReason,
      retentionAmount: shipmentState.retentionAmount,
      paymentDate: shipmentState.paymentDate,
      releaseDate: shipmentState.releaseDate,
      fiscalNotes: shipmentState.fiscalNotes,
    };
    
    // Show the retention sheet/modal
    const retentionSheet = document.getElementById('retention-edit-form');
    if (retentionSheet) {
      retentionSheet.classList.add('show');
    } else {
      // If the sheet doesn't exist in the DOM, we use the fiscal action update directly
      handleSaveFiscalAction();
    }
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
        actionNumber: shipmentState.actionNumber,
        reason: shipmentState.retentionReason,
        amountToPay: parseFloat(shipmentState.retentionAmount || "0"),
        paymentDate: shipmentState.paymentDate,
        releaseDate: shipmentState.releaseDate,
        notes: shipmentState.fiscalNotes,
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
