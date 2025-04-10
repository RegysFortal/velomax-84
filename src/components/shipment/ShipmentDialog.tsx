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
import { useClients } from "@/contexts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShipmentFormSection } from "./ShipmentFormSection";
import { RetentionFormSection } from "./RetentionFormSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDialog({ open, onOpenChange }: ShipmentDialogProps) {
  const { addShipment, shipments } = useShipments();
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
  
  // Duplicate tracking number alert
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  
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
      setShowDuplicateAlert(false);
      setSubmissionData(null);
      
      // Debug logs
      console.log("ShipmentDialog - Reset form");
    }
  }, [open]);
  
  const checkDuplicateTrackingNumber = (trackingNum: string) => {
    return shipments.some(s => s.trackingNumber === trackingNum);
  };
  
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
      
      // Check for duplicate tracking number
      if (checkDuplicateTrackingNumber(trackingNumber.trim())) {
        // Save submission data for later use if user confirms
        setSubmissionData({
          shipmentData,
          fiscalActionData: status === "retained" ? {
            reason: retentionReason.trim(),
            amountToPay: parseFloat(retentionAmount) || 0,
            paymentDate: paymentDate || undefined,
          } : undefined
        });
        
        // Show duplicate confirmation dialog
        setShowDuplicateAlert(true);
        return;
      }
      
      // If no duplicate, proceed normally
      if (status === "retained") {
        // Create fiscal action data without ID, createdAt, updatedAt
        const fiscalActionData = {
          reason: retentionReason.trim(),
          amountToPay: parseFloat(retentionAmount) || 0,
          paymentDate: paymentDate || undefined,
        };
        
        // Include fiscal action in shipment data
        await addShipment({
          ...shipmentData,
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
  
  const handleConfirmDuplicate = async () => {
    if (!submissionData) return;
    
    try {
      const { shipmentData, fiscalActionData } = submissionData;
      
      if (fiscalActionData) {
        await addShipment({
          ...shipmentData,
          fiscalActionData,
        });
      } else {
        await addShipment(shipmentData);
      }
      
      toast.success("Embarque criado com sucesso");
      setShowDuplicateAlert(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao salvar embarque");
      console.error(error);
    }
  };

  return (
    <>
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
                shipmentId=""
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
      
      {/* Duplicate tracking number alert dialog */}
      <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Número de conhecimento duplicado</AlertDialogTitle>
            <AlertDialogDescription>
              Já existe um embarque com o número de conhecimento <span className="font-semibold">{trackingNumber}</span>.
              Deseja realmente criar outro embarque com o mesmo número?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDuplicateAlert(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDuplicate} className="bg-orange-600 hover:bg-orange-700">
              Sim, criar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
