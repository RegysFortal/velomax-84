
import { useState, useEffect } from "react";
import { Shipment, ShipmentStatus, TransportMode } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";
import { toISODateString } from "@/utils/dateUtils";

export function useShipmentEditForm(
  shipment: Shipment | null,
  onOpenChange: (open: boolean) => void
) {
  const { updateShipment, updateFiscalAction, refreshShipmentsData } = useShipments();
  const [isFormReady, setIsFormReady] = useState(false);
  
  // Form state
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [transportMode, setTransportMode] = useState<TransportMode>("air");
  const [carrierName, setCarrierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState("");
  const [weight, setWeight] = useState("");
  const [shipmentDate, setShipmentDate] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("in_transit");
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [actionNumber, setActionNumber] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");
  
  // Load shipment data when opened
  useEffect(() => {
    if (shipment) {
      console.log("ShipmentEditDialog - Loading shipment data:", shipment);
      setCompanyId(shipment.companyId);
      setCompanyName(shipment.companyName);
      setTransportMode(shipment.transportMode);
      setCarrierName(shipment.carrierName);
      setTrackingNumber(shipment.trackingNumber);
      setPackages(shipment.packages.toString());
      setWeight(shipment.weight.toString());
      setShipmentDate(shipment.shipmentDate || toISODateString(new Date()));
      setStatus(shipment.status);
      
      // Load retention data if present
      if (shipment.fiscalAction) {
        setRetentionReason(shipment.fiscalAction.reason || "");
        setRetentionAmount(shipment.fiscalAction.amountToPay?.toString() || "");
        setPaymentDate(shipment.fiscalAction.paymentDate || "");
        setReleaseDate(shipment.fiscalAction.releaseDate || "");
        setActionNumber(shipment.fiscalAction.actionNumber || "");
        setFiscalNotes(shipment.fiscalAction.notes || "");
      } else {
        setRetentionReason("");
        setRetentionAmount("");
        setPaymentDate("");
        setReleaseDate("");
        setActionNumber("");
        setFiscalNotes("");
      }
      
      setIsFormReady(true);
    }
  }, [shipment]);
  
  const handleSubmit = async () => {
    if (!shipment) return;
    
    try {
      console.log("ShipmentEditDialog - Submitting form");
      
      const packageCount = parseInt(packages || "0");
      const weightValue = parseFloat(weight || "0");
      
      if (!companyId.trim() || !carrierName.trim() || !trackingNumber.trim()) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      
      if (isNaN(packageCount) || isNaN(weightValue) || packageCount < 0 || weightValue < 0) {
        toast.error("Volumes e peso devem ser valores numéricos válidos");
        return;
      }
      
      // Update shipment
      const shipmentUpdate = {
        companyId: companyId.trim(),
        companyName,
        transportMode,
        carrierName: carrierName.trim(),
        trackingNumber: trackingNumber.trim(),
        packages: packageCount,
        weight: weightValue,
        shipmentDate: shipmentDate || undefined,
        status,
        isRetained: status === "retained"
      };
      
      console.log("ShipmentEditDialog - Updating shipment with:", shipmentUpdate);
      await updateShipment(shipment.id, shipmentUpdate);
      
      // If retained, update or create fiscal action
      if (status === "retained") {
        const retentionAmountValue = parseFloat(retentionAmount || "0");
        
        if (!retentionReason.trim()) {
          toast.error("Informe o motivo da retenção");
          return;
        }
        
        const fiscalActionUpdate = {
          actionNumber: actionNumber.trim() || undefined,
          reason: retentionReason.trim(),
          amountToPay: retentionAmountValue,
          paymentDate: paymentDate || undefined,
          releaseDate: releaseDate || undefined,
          notes: fiscalNotes.trim() || undefined
        };
        
        console.log("ShipmentEditDialog - Updating fiscal action with:", fiscalActionUpdate);
        await updateFiscalAction(shipment.id, fiscalActionUpdate);
      }
      
      toast.success("Embarque atualizado com sucesso");
      onOpenChange(false);
      refreshShipmentsData();
    } catch (error) {
      console.error("Erro ao atualizar embarque:", error);
      toast.error("Erro ao atualizar embarque");
    }
  };

  return {
    isFormReady,
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
    shipmentDate,
    setShipmentDate,
    status,
    setStatus,
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
    handleSubmit
  };
}
