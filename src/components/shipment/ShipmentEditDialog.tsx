
import React, { useEffect, useState } from "react";
import { useShipments } from "@/contexts/shipments";
import { useClients } from "@/contexts/clients";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShipmentFormContent } from "./ShipmentFormContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormLoadingState } from "./components/FormLoadingState";
import { Shipment, ShipmentStatus, TransportMode } from "@/types/shipment";
import { toast } from "sonner";

interface ShipmentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment | null;
}

export function ShipmentEditDialog({ 
  open, 
  onOpenChange, 
  shipment 
}: ShipmentEditDialogProps) {
  const { clients } = useClients();
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
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("in_transit");
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [actionNumber, setActionNumber] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");
  
  // Load shipment data when opened
  useEffect(() => {
    if (open && shipment) {
      setCompanyId(shipment.companyId);
      setCompanyName(shipment.companyName);
      setTransportMode(shipment.transportMode);
      setCarrierName(shipment.carrierName);
      setTrackingNumber(shipment.trackingNumber);
      setPackages(shipment.packages.toString());
      setWeight(shipment.weight.toString());
      setArrivalFlight(shipment.arrivalFlight || "");
      setArrivalDate(shipment.arrivalDate || "");
      setObservations(shipment.observations || "");
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
  }, [open, shipment]);
  
  const handleSubmit = async () => {
    if (!shipment) return;
    
    try {
      const packageCount = parseInt(packages || "0");
      const weightValue = parseFloat(weight || "0");
      
      // Update shipment
      await updateShipment(shipment.id, {
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
        isRetained: status === "retained"
      });
      
      // If retained, update or create fiscal action
      if (status === "retained") {
        const retentionAmountValue = parseFloat(retentionAmount || "0");
        
        await updateFiscalAction(shipment.id, {
          actionNumber: actionNumber.trim() || undefined,
          reason: retentionReason.trim(),
          amountToPay: retentionAmountValue,
          paymentDate: paymentDate || undefined,
          releaseDate: releaseDate || undefined,
          notes: fiscalNotes.trim() || undefined
        });
      }
      
      toast.success("Embarque atualizado com sucesso");
      onOpenChange(false);
      refreshShipmentsData();
    } catch (error) {
      console.error("Erro ao atualizar embarque:", error);
      toast.error("Erro ao atualizar embarque");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Embarque</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          {!isFormReady ? (
            <FormLoadingState />
          ) : (
            <div className="px-1 py-2">
              <ShipmentFormContent
                companyId={companyId}
                setCompanyId={setCompanyId}
                setCompanyName={setCompanyName}
                transportMode={transportMode}
                setTransportMode={setTransportMode}
                carrierName={carrierName}
                setCarrierName={setCarrierName}
                trackingNumber={trackingNumber}
                setTrackingNumber={setTrackingNumber}
                packages={packages}
                setPackages={setPackages}
                weight={weight}
                setWeight={setWeight}
                arrivalFlight={arrivalFlight}
                setArrivalFlight={setArrivalFlight}
                arrivalDate={arrivalDate}
                setArrivalDate={setArrivalDate}
                observations={observations}
                setObservations={setObservations}
                status={status}
                setStatus={setStatus}
                retentionReason={retentionReason}
                setRetentionReason={setRetentionReason}
                retentionAmount={retentionAmount}
                setRetentionAmount={setRetentionAmount}
                paymentDate={paymentDate}
                setPaymentDate={setPaymentDate}
                actionNumber={actionNumber}
                setActionNumber={setActionNumber}
                releaseDate={releaseDate}
                setReleaseDate={setReleaseDate}
                fiscalNotes={fiscalNotes}
                setFiscalNotes={setFiscalNotes}
                clients={clients}
                onSubmit={handleSubmit}
                onCancel={() => onOpenChange(false)}
              />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
