
import { useState } from 'react';
import { Shipment, ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from "@/contexts/DeliveriesContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function useShipmentDetails(shipment: Shipment, onClose: () => void) {
  const { updateShipment, deleteShipment, updateStatus, updateFiscalAction } = useShipments();
  const { addDelivery } = useDeliveries();
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
  
  const handleStatusChange = async (newStatus: ShipmentStatus, details?: any) => {
    try {
      console.log(`Changing status to: ${newStatus}`, details);
      
      // Prepare shipment update data
      let updateData: Partial<Shipment> = { 
        status: newStatus,
        isRetained: newStatus === "retained"
      };
      
      // If delivered_final and we have delivery details, add them
      if (newStatus === "delivered_final" && details) {
        updateData = {
          ...updateData,
          receiverName: details.receiverName,
          deliveryDate: details.deliveryDate,
          deliveryTime: details.deliveryTime
        };
        
        // Create a new delivery entry when status is changed to delivered_final
        try {
          const minuteNumber = `${shipment.trackingNumber}-${new Date().getTime().toString().slice(-4)}`;
          
          console.log("Creating delivery from shipment with data:", {
            minuteNumber,
            clientId: shipment.companyId,
            deliveryDate: details.deliveryDate,
            deliveryTime: details.deliveryTime,
            receiver: details.receiverName,
            weight: shipment.weight,
            packages: shipment.packages
          });
          
          // Create a new delivery from this shipment with improved error handling
          const newDelivery = await addDelivery({
            minuteNumber,
            clientId: shipment.companyId,
            deliveryDate: details.deliveryDate,
            deliveryTime: details.deliveryTime,
            receiver: details.receiverName,
            weight: shipment.weight,
            packages: shipment.packages,
            deliveryType: 'standard', // Default delivery type
            cargoType: 'standard', // Default cargo type
            totalFreight: 0, // This might need calculation based on your business logic
            notes: `Entrega gerada automaticamente do embarque ${shipment.trackingNumber}`
          });
          
          console.log("Delivery created successfully:", newDelivery);
          toast.success("Embarque finalizado e entrega criada com sucesso");
        } catch (error) {
          console.error("Error creating delivery from shipment:", error);
          toast.error("Embarque finalizado, mas houve um erro ao criar a entrega");
        }
      }
      
      // If changing to "retained" and we have retention details
      if (newStatus === "retained" && details && details.retentionReason) {
        // First update the shipment status
        await updateShipment(shipment.id, updateData);
        
        // Then create/update the fiscal action
        const retentionAmountValue = parseFloat(details.retentionAmount || "0");
        
        await updateFiscalAction(shipment.id, {
          actionNumber: details.actionNumber?.trim() || undefined,
          reason: details.retentionReason.trim(),
          amountToPay: retentionAmountValue,
          paymentDate: details.paymentDate || undefined,
          releaseDate: details.releaseDate || undefined,
          notes: details.fiscalNotes?.trim() || undefined,
        });
        
        toast.success("Status alterado para Retida e informações de retenção atualizadas");
        
        // Update the local state
        setStatus("retained");
        setRetentionReason(details.retentionReason);
        setRetentionAmount(details.retentionAmount);
        setPaymentDate(details.paymentDate);
        setReleaseDate(details.releaseDate);
        setActionNumber(details.actionNumber);
        setFiscalNotes(details.fiscalNotes);
        
        return;
      }
      
      // For other statuses, simply update the shipment
      await updateShipment(shipment.id, updateData);
      
      if (newStatus !== "delivered_final") {
        toast.success(`Status alterado para ${newStatus}`);
      }
      
      // If status is no longer "retained", clear fiscal action
      if (shipment.status === "retained" && newStatus !== "retained") {
        await updateFiscalAction(shipment.id, null);
      }
      
      // Update local state
      setStatus(newStatus);
      if (details && newStatus === "delivered_final") {
        setReceiverName(details.receiverName);
        setDeliveryDate(details.deliveryDate);
        setDeliveryTime(details.deliveryTime);
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
