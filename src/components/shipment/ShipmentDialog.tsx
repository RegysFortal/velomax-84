
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShipments } from "@/contexts/ShipmentsContext";
import { ShipmentStatus } from "@/types/shipment";
import { toast } from "sonner";
import { useClients } from "@/contexts/ClientsContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShipmentFormSection } from "./ShipmentFormSection";
import { RetentionFormSection } from "./RetentionFormSection";

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDialog({ open, onOpenChange }: ShipmentDialogProps) {
  const { addShipment } = useShipments();
  const { clients } = useClients();
  
  // Form state
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [transportMode, setTransportMode] = useState<"air" | "road">("air");
  const [carrierName, setCarrierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState("");
  const [weight, setWeight] = useState("");
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("in_transit");
  const [observations, setObservations] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  
  // Retention-specific fields
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Reset form for a new shipment
      setCompanyId("");
      setCompanyName("");
      setTransportMode("air");
      setCarrierName("");
      setTrackingNumber("");
      setPackages("");
      setWeight("");
      setArrivalFlight("");
      setArrivalDate("");
      setStatus("in_transit");
      setObservations("");
      setDeliveryDate("");
      setDeliveryTime("");
      setRetentionReason("");
      setRetentionAmount("");
      setPaymentDate("");
      
      // Debug logs
      console.log("ShipmentDialog - Reset form");
    }
  }, [open]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // Get company name from the selected client
      const selectedClient = clients.find(c => c.id === companyId);
      const clientName = selectedClient ? selectedClient.name : "";
      
      console.log("ShipmentDialog - Cliente selecionado:", selectedClient);
      console.log("ShipmentDialog - CompanyId:", companyId);
      
      // Build shipment object with all required fields
      const shipmentData = {
        companyId: companyId.trim(),
        companyName: clientName,
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
      
      // Add fiscal action if status is retained
      if (status === "retained") {
        // Create fiscal action data without ID, createdAt, updatedAt
        // These will be added by the addShipment function in the context
        const fiscalActionData = {
          reason: retentionReason.trim(),
          amountToPay: parseFloat(retentionAmount) || 0,
          paymentDate: paymentDate || undefined,
        };
        
        // Include fiscal action in shipment data
        await addShipment({
          ...shipmentData,
          // We're passing fiscalActionData, not a complete FiscalAction
          // The ShipmentContext.addShipment will handle creating the complete FiscalAction
          fiscalActionData,
        });
      } else {
        await addShipment(shipmentData);
      }
      
      toast.success("Embarque criado com sucesso");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao salvar embarque");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Novo Embarque</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(95vh-130px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <ShipmentFormSection 
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
              clients={clients}
            />
            
            {status === "retained" && (
              <RetentionFormSection 
                retentionReason={retentionReason}
                setRetentionReason={setRetentionReason}
                retentionAmount={retentionAmount}
                setRetentionAmount={setRetentionAmount}
                paymentDate={paymentDate}
                setPaymentDate={setPaymentDate}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
