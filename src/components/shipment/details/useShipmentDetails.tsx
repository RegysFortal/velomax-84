import { useState, useEffect } from 'react';
import { Shipment, ShipmentStatus, Document } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { useDeliveries } from '@/contexts/deliveries/useDeliveries';
import { toast } from "sonner";

export function useShipmentDetails(shipment: Shipment, onClose: () => void) {
  const { updateShipment, deleteShipment, updateStatus, updateFiscalAction, updateDocument } = useShipments();
  const { addDelivery } = useDeliveries();
  
  const [isEditing, setIsEditing] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
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
      
      if (status === "retained" && !retentionReason.trim()) {
        toast.error("Informe o motivo da retenção");
        return;
      }
      
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
      onClose();
    } catch (error) {
      toast.error("Erro ao remover embarque");
      console.error(error);
    }
  };
  
  const getStatusLabel = (status: ShipmentStatus): string => {
    switch (status) {
      case "in_transit": return "Em Trânsito";
      case "retained": return "Retida";
      case "delivered": return "Retirada";
      case "partially_delivered": return "Entregue Parcial";
      case "delivered_final": return "Entregue";
      default: return status;
    }
  };
  
  const handleStatusChange = async (newStatus: ShipmentStatus, details?: any) => {
    try {
      console.log(`Changing status to: ${newStatus}`, details);
      
      let updateData: Partial<Shipment> = { 
        status: newStatus,
        isRetained: newStatus === "retained"
      };
      
      if ((newStatus === "delivered_final" || newStatus === "partially_delivered") && 
          details && details.selectedDocumentIds) {
        const selectedDocumentIds = details.selectedDocumentIds;
        
        if (shipment.documents && shipment.documents.length > 0) {
          const updatedDocuments: Document[] = [...shipment.documents];
          const selectedDocuments: Document[] = [];
          
          for (let i = 0; i < updatedDocuments.length; i++) {
            if (selectedDocumentIds.includes(updatedDocuments[i].id)) {
              updatedDocuments[i] = {
                ...updatedDocuments[i],
                isDelivered: true
              };
              selectedDocuments.push(updatedDocuments[i]);
              
              await updateDocument(shipment.id, updatedDocuments[i].id, updatedDocuments);
            }
          }
          
          console.log(`Creating ${selectedDocuments.length} deliveries from selected documents`);
          
          for (const document of selectedDocuments) {
            const minuteNumber = document.minuteNumber || 
                              `${shipment.trackingNumber}-${document.id.substring(0, 4)}`;
            
            const deliveryData = {
              minuteNumber,
              clientId: shipment.companyId,
              deliveryDate: details.deliveryDate,
              deliveryTime: details.deliveryTime,
              receiver: details.receiverName,
              weight: document.weight !== undefined ? Number(document.weight) : shipment.weight,
              packages: document.packages !== undefined ? document.packages : shipment.packages,
              deliveryType: 'standard' as const,
              cargoType: 'standard' as const,
              totalFreight: 0,
              notes: `Entrega do documento ${document.name} do embarque ${shipment.trackingNumber}`
            };
            
            if (document.invoiceNumbers && document.invoiceNumbers.length > 0) {
              const invoiceList = document.invoiceNumbers.join(', ');
              deliveryData.notes = `${deliveryData.notes}\nNotas Fiscais: ${invoiceList}`;
            }
            
            await addDelivery(deliveryData);
            console.log(`Created delivery for document: ${document.name}`);
          }
          
          updateData.documents = updatedDocuments;
          
          const allDocumentsDelivered = updatedDocuments.every(doc => doc.isDelivered);
          const someDocumentsDelivered = updatedDocuments.some(doc => doc.isDelivered);
          
          if (allDocumentsDelivered) {
            updateData.status = "delivered_final";
          } else if (someDocumentsDelivered) {
            updateData.status = "partially_delivered";
          } else {
            updateData.status = "in_transit";
          }
          
          updateData.deliveryDate = details.deliveryDate;
          updateData.deliveryTime = details.deliveryTime;
          updateData.receiverName = details.receiverName;
          
          await updateStatus(shipment.id, updateData.status);
          
          if (allDocumentsDelivered) {
            toast.success(`${selectedDocuments.length} entregas criadas com sucesso. Todos os documentos entregues.`);
          } else if (someDocumentsDelivered) {
            toast.success(`${selectedDocuments.length} entregas criadas com sucesso. Embarque marcado como entrega parcial.`);
          } else {
            toast.success(`${selectedDocuments.length} entregas criadas com sucesso. Embarque ainda tem documentos em trânsito.`);
          }
          
          setStatus(updateData.status);
          window.dispatchEvent(new CustomEvent('shipments-updated'));
          return;
        }
      }
      
      if (newStatus === "delivered_final" && details) {
        updateData = {
          ...updateData,
          receiverName: details.receiverName,
          deliveryDate: details.deliveryDate,
          deliveryTime: details.deliveryTime
        };
        
        await updateStatus(shipment.id, "delivered_final");
        
        if (shipment.documents && shipment.documents.length > 0) {
          const updatedDocuments = shipment.documents.map(doc => ({
            ...doc,
            isDelivered: true
          }));
          
          for (const doc of updatedDocuments) {
            await updateDocument(shipment.id, doc.id, updatedDocuments);
          }
          
          updateData.documents = updatedDocuments;
          
          console.log(`Creating ${shipment.documents.length} deliveries from all documents`);
          
          for (const document of shipment.documents) {
            const minuteNumber = document.minuteNumber || 
                              `${shipment.trackingNumber}-${document.id.substring(0, 4)}`;
            
            const deliveryData = {
              minuteNumber,
              clientId: shipment.companyId,
              deliveryDate: details.deliveryDate,
              deliveryTime: details.deliveryTime,
              receiver: details.receiverName,
              weight: document.weight !== undefined ? Number(document.weight) : shipment.weight,
              packages: document.packages !== undefined ? document.packages : shipment.packages,
              deliveryType: 'standard' as const,
              cargoType: 'standard' as const,
              totalFreight: 0,
              notes: `Entrega do documento ${document.name} do embarque ${shipment.trackingNumber}`
            };
            
            if (document.invoiceNumbers && document.invoiceNumbers.length > 0) {
              const invoiceList = document.invoiceNumbers.join(', ');
              deliveryData.notes = `${deliveryData.notes}\nNotas Fiscais: ${invoiceList}`;
            }
            
            await addDelivery(deliveryData);
            console.log(`Created delivery for document: ${document.name}`);
          }
          
          toast.success(`${shipment.documents.length} entregas criadas com sucesso`);
        } else {
          try {
            const minuteNumber = `${shipment.trackingNumber}-${new Date().getTime().toString().slice(-4)}`;
            
            console.log("Creating single delivery from shipment with data:", {
              minuteNumber,
              clientId: shipment.companyId,
              deliveryDate: details.deliveryDate,
              deliveryTime: details.deliveryTime,
              receiver: details.receiverName,
              weight: shipment.weight,
              packages: shipment.packages
            });
            
            const deliveryData = {
              minuteNumber,
              clientId: shipment.companyId,
              deliveryDate: details.deliveryDate,
              deliveryTime: details.deliveryTime,
              receiver: details.receiverName,
              weight: shipment.weight,
              packages: shipment.packages,
              deliveryType: 'standard' as const,
              cargoType: 'standard' as const,
              totalFreight: 0,
              notes: `Entrega gerada do embarque ${shipment.trackingNumber}`
            };
            
            await addDelivery(deliveryData);
            console.log("Delivery created successfully");
          } catch (error) {
            console.error("Error creating delivery from shipment:", error);
            toast.error("Embarque finalizado, mas houve um erro ao criar a entrega");
          }
        }
      }
      
      if (newStatus === "retained" && details && details.retentionReason) {
        await updateStatus(shipment.id, newStatus);
        
        await updateShipment(shipment.id, updateData);
        
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
        
        setStatus("retained");
        setRetentionReason(details.retentionReason);
        setRetentionAmount(details.retentionAmount);
        setPaymentDate(details.paymentDate);
        setReleaseDate(details.releaseDate);
        setActionNumber(details.actionNumber);
        setFiscalNotes(details.fiscalNotes);
        
        return;
      }
      
      await updateShipment(shipment.id, updateData);
      
      setTimeout(() => {
        window.dispatchEvent(new Event('deliveries-updated'));
      }, 1000);
      
      if (newStatus === "delivered_final") {
        toast.success("Status alterado para Entregue e entregas criadas");
      } else if (newStatus === "partially_delivered") {
        toast.success("Status alterado para Entrega Parcial");
      } else {
        toast.success(`Status alterado para ${getStatusLabel(newStatus)}`);
      }
      
      if (shipment.status === "retained" && newStatus !== "retained") {
        await updateFiscalAction(shipment.id, null);
      }
      
      setStatus(updateData.status || newStatus);
      if (details && (newStatus === "delivered_final" || newStatus === "partially_delivered")) {
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
    handleStatusChange,
    getStatusLabel
  };
}
