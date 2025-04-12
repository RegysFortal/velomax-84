
import { useState } from 'react';
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

export function useShipmentDetails(shipment: Shipment, onClose: () => void) {
  const { updateShipment, deleteShipment, updateStatus, updateFiscalAction } = useShipments();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
  // Form state
  const [companyId, setCompanyId] = useState(shipment.companyId);
  const [companyName, setCompanyName] = useState(shipment.companyName);
  const [transportMode, setTransportMode] = useState<"air" | "road">(shipment.transportMode);
  const [carrierName, setCarrierName] = useState(shipment.carrierName);
  const [trackingNumber, setTrackingNumber] = useState(shipment.trackingNumber);
  const [packages, setPackages] = useState(shipment.packages.toString());
  const [weight, setWeight] = useState(shipment.weight.toString());
  const [arrivalFlight, setArrivalFlight] = useState(shipment.arrivalFlight || "");
  const [arrivalDate, setArrivalDate] = useState(shipment.arrivalDate || "");
  const [status, setStatus] = useState<ShipmentStatus>(shipment.status);
  const [observations, setObservations] = useState(shipment.observations || "");
  const [deliveryDate, setDeliveryDate] = useState(shipment.deliveryDate || "");
  const [deliveryTime, setDeliveryTime] = useState(shipment.deliveryTime || "");
  const [receiverName, setReceiverName] = useState(shipment.receiverName || "");
  
  // Retention-specific fields
  const [retentionReason, setRetentionReason] = useState(shipment.fiscalAction?.reason || "");
  const [retentionAmount, setRetentionAmount] = useState(shipment.fiscalAction?.amountToPay.toString() || "");
  const [paymentDate, setPaymentDate] = useState(shipment.fiscalAction?.paymentDate || "");
  const [releaseDate, setReleaseDate] = useState(shipment.fiscalAction?.releaseDate || "");
  const [actionNumber, setActionNumber] = useState(shipment.fiscalAction?.actionNumber || "");
  const [fiscalNotes, setFiscalNotes] = useState(shipment.fiscalAction?.notes || "");
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    
    // Reset form state to original shipment values
    setCompanyId(shipment.companyId);
    setCompanyName(shipment.companyName);
    setTransportMode(shipment.transportMode);
    setCarrierName(shipment.carrierName);
    setTrackingNumber(shipment.trackingNumber);
    setPackages(shipment.packages.toString());
    setWeight(shipment.weight.toString());
    setArrivalFlight(shipment.arrivalFlight || "");
    setArrivalDate(shipment.arrivalDate || "");
    setStatus(shipment.status);
    setObservations(shipment.observations || "");
    setDeliveryDate(shipment.deliveryDate || "");
    setDeliveryTime(shipment.deliveryTime || "");
    setReceiverName(shipment.receiverName || "");
    setRetentionReason(shipment.fiscalAction?.reason || "");
    setRetentionAmount(shipment.fiscalAction?.amountToPay.toString() || "");
    setPaymentDate(shipment.fiscalAction?.paymentDate || "");
    setReleaseDate(shipment.fiscalAction?.releaseDate || "");
    setActionNumber(shipment.fiscalAction?.actionNumber || "");
    setFiscalNotes(shipment.fiscalAction?.notes || "");
  };
  
  const handleSave = async () => {
    try {
      // Validate form
      if (!companyId.trim() || !carrierName.trim() || !trackingNumber.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      const packageCount = parseInt(packages || "0");
      const weightValue = parseFloat(weight || "0");
      
      if (isNaN(packageCount) || isNaN(weightValue) || packageCount < 0 || weightValue < 0) {
        toast.error("Volumes e peso devem ser valores numéricos válidos");
        return;
      }
      
      // Validate retention-specific fields if status is "retained"
      if (status === "retained" && !retentionReason.trim()) {
        toast.error("Informe o motivo da retenção");
        return;
      }
      
      // Build updated shipment object
      const updatedShipment = {
        companyId: companyId.trim(),
        companyName,
        transportMode,
        carrierName: carrierName.trim(),
        trackingNumber: trackingNumber.trim(),
        packages: packageCount,
        weight: weightValue,
        arrivalFlight: arrivalFlight.trim() || undefined,
        arrivalDate: arrivalDate || undefined,
        observations: observations.trim() || undefined,
        status,
        isRetained: status === "retained",
        deliveryDate: deliveryDate || undefined,
        deliveryTime: deliveryTime || undefined,
        receiverName: receiverName || undefined,
      };
      
      await updateShipment(shipment.id, updatedShipment);

      // Update fiscal action if status is retained
      if (status === "retained") {
        const retentionAmountValue = parseFloat(retentionAmount || "0");
        
        if (isNaN(retentionAmountValue)) {
          toast.error("Valor da retenção deve ser numérico");
          return;
        }
        
        await updateFiscalAction(shipment.id, {
          actionNumber: actionNumber.trim() || undefined,
          reason: retentionReason.trim(),
          amountToPay: retentionAmountValue,
          paymentDate: paymentDate || undefined,
          releaseDate: releaseDate || undefined,
          notes: fiscalNotes.trim() || undefined,
        });
      }
      
      toast.success("Embarque atualizado com sucesso");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar embarque");
      console.error(error);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteShipment(shipment.id);
      toast.success("Embarque removido com sucesso");
      setDeleteAlertOpen(false);
      onClose(); // Close the dialog after successful deletion
    } catch (error) {
      toast.error("Erro ao remover embarque");
      console.error(error);
    }
  };
  
  const handleStatusChange = async (newStatus: ShipmentStatus, deliveryDetails?: any) => {
    try {
      let updateData: Partial<Shipment> = { status: newStatus };
      
      // If delivered_final and we have delivery details, add them
      if (newStatus === "delivered_final" && deliveryDetails) {
        updateData = {
          ...updateData,
          receiverName: deliveryDetails.receiverName,
          deliveryDate: deliveryDetails.deliveryDate,
          deliveryTime: deliveryDetails.deliveryTime
        };
      }
      
      // If changing to "retained", set isRetained to true
      if (newStatus === "retained") {
        updateData.isRetained = true;
      } else {
        updateData.isRetained = false;
      }
      
      await updateShipment(shipment.id, updateData);
      toast.success(`Status alterado para ${newStatus}`);
      
      // If status is no longer "retained", clear fiscal action
      if (shipment.status === "retained" && newStatus !== "retained") {
        await updateFiscalAction(shipment.id, null);
      }
      
      // Update local state
      setStatus(newStatus);
      if (deliveryDetails) {
        setReceiverName(deliveryDetails.receiverName);
        setDeliveryDate(deliveryDetails.deliveryDate);
        setDeliveryTime(deliveryDetails.deliveryTime);
      }
    } catch (error) {
      toast.error("Erro ao alterar status");
      console.error(error);
    }
  };
  
  return {
    isEditing,
    setIsEditing,
    deleteAlertOpen,
    setDeleteAlertOpen,
    companyId,
    setCompanyId,
    companyName,
    setCompanyName,
    transportMode,
    setTransportMode,
    carrierName,
    setCarrierName,
    trackingNumber,
    setTrackingNumber,
    packages,
    setPackages,
    weight,
    setWeight,
    arrivalFlight,
    setArrivalFlight,
    arrivalDate,
    setArrivalDate,
    status,
    setStatus,
    observations,
    setObservations,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    receiverName,
    setReceiverName,
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
    handleEditClick,
    handleCancelEdit,
    handleSave,
    handleDelete,
    handleStatusChange
  };
}
