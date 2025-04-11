
import { useState } from 'react';
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

export function useShipmentDetails(shipment: Shipment, onClose: () => void) {
  const { updateShipment, deleteShipment, updateStatus } = useShipments();
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
  
  // Retention-specific fields
  const [retentionReason, setRetentionReason] = useState(shipment.fiscalAction?.reason || "");
  const [retentionAmount, setRetentionAmount] = useState(shipment.fiscalAction?.amountToPay.toString() || "");
  const [paymentDate, setPaymentDate] = useState(shipment.fiscalAction?.paymentDate || "");
  
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
    setRetentionReason(shipment.fiscalAction?.reason || "");
    setRetentionAmount(shipment.fiscalAction?.amountToPay.toString() || "");
    setPaymentDate(shipment.fiscalAction?.paymentDate || "");
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
      };
      
      await updateShipment(shipment.id, updatedShipment);
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
  
  const handleStatusChange = async (newStatus: ShipmentStatus) => {
    try {
      await updateStatus(shipment.id, newStatus);
      toast.success(`Status alterado para ${newStatus}`);
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
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    handleEditClick,
    handleCancelEdit,
    handleSave,
    handleDelete,
    handleStatusChange
  };
}
