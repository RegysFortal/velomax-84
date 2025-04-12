
import { useState } from 'react';
import { toast } from "sonner";
import { ShipmentFormData } from "../types/shipmentFormTypes";
import { ShipmentStatus } from "@/types/shipment";

export interface SubmissionData {
  shipmentData: any;
  fiscalActionData?: {
    reason: string;
    amountToPay: number;
    paymentDate?: string;
  };
}

interface UseShipmentFormSubmitProps {
  companyId: string;
  companyName: string; // Added this property
  carrierName: string;
  trackingNumber: string;
  packages: string;
  weight: string;
  transportMode: "air" | "road";
  arrivalFlight: string;
  arrivalDate: string;
  observations: string;
  status: ShipmentStatus;
  retentionReason: string;
  retentionAmount: string;
  paymentDate: string;
  releaseDate?: string; // Added as optional
  fiscalNotes?: string; // Added as optional
  actionNumber?: string; // Added as optional
  clients: any[];
  addShipment: (shipment: any) => Promise<any>;
  checkDuplicateTrackingNumber: (trackingNum: string) => boolean;
  closeDialog: () => void;
}

export function useShipmentFormSubmit({
  companyId,
  companyName,
  carrierName,
  trackingNumber,
  packages,
  weight,
  transportMode,
  arrivalFlight,
  arrivalDate,
  observations,
  status,
  retentionReason,
  retentionAmount,
  paymentDate,
  releaseDate,
  actionNumber,
  fiscalNotes,
  clients,
  addShipment,
  checkDuplicateTrackingNumber,
  closeDialog
}: UseShipmentFormSubmitProps) {
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);

  const validateForm = (): boolean => {
    // Validate required fields
    if (!companyId.trim()) {
      toast.error("Por favor, selecione um cliente");
      return false;
    }
    
    // Verify if client exists
    const clientExists = clients.some(client => client.id === companyId);
    if (!clientExists) {
      toast.error("Cliente selecionado não é válido");
      return false;
    }
    
    if (!carrierName.trim() || !trackingNumber.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return false;
    }
    
    const packageCount = parseInt(packages || "0");
    const weightValue = parseFloat(weight || "0");
    
    if (isNaN(packageCount) || isNaN(weightValue) || packageCount < 0 || weightValue < 0) {
      toast.error("Volumes e peso devem ser valores numéricos válidos");
      return false;
    }
    
    // Validate retention-specific fields if status is "retained"
    if (status === "retained" && !retentionReason.trim()) {
      toast.error("Informe o motivo da retenção");
      return false;
    }

    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      // Get company name from the selected client
      const selectedClient = clients.find(c => c.id === companyId);
      const clientName = selectedClient ? (selectedClient.tradingName || selectedClient.name) : "";
      
      console.log("ShipmentDialog - Cliente selecionado:", selectedClient);
      console.log("ShipmentDialog - CompanyId:", companyId);
      
      const packageCount = parseInt(packages || "0");
      const weightValue = parseFloat(weight || "0");
      
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
        deliveryDate: undefined,
        deliveryTime: undefined,
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
      closeDialog();
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
      closeDialog();
    } catch (error) {
      toast.error("Erro ao salvar embarque");
      console.error(error);
    }
  };

  return {
    showDuplicateAlert,
    setShowDuplicateAlert,
    handleSubmit,
    handleConfirmDuplicate
  };
}
