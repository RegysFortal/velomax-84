
import { useState } from 'react';
import { Client } from '@/types';
import { ShipmentStatus, TransportMode, Shipment } from '@/types/shipment';
import { ShipmentCreateData } from '@/contexts/shipments/types';
import { toast } from 'sonner';

interface UseShipmentFormSubmitProps {
  companyId: string;
  companyName: string;
  transportMode: TransportMode;
  carrierName: string;
  trackingNumber: string;
  packages: string;
  weight: string;
  shipmentDate: string;
  status: ShipmentStatus;
  retentionReason?: string;
  retentionAmount?: string;
  paymentDate?: string;
  releaseDate?: string;
  actionNumber?: string;
  fiscalNotes?: string;
  clients: Client[];
  addShipment: (shipment: ShipmentCreateData) => Promise<Shipment>;
  checkDuplicateTrackingNumberForCompany: (trackingNumber: string, companyId: string) => boolean;
  closeDialog: () => void;
}

export function useShipmentFormSubmit({
  companyId,
  companyName,
  transportMode,
  carrierName,
  trackingNumber,
  packages,
  weight,
  shipmentDate,
  status,
  retentionReason,
  retentionAmount,
  paymentDate,
  releaseDate,
  actionNumber,
  fiscalNotes,
  clients,
  addShipment,
  checkDuplicateTrackingNumberForCompany,
  closeDialog
}: UseShipmentFormSubmitProps) {
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  
  const validateForm = () => {
    if (!companyId) {
      toast.error("Por favor, selecione um cliente");
      return false;
    }
    
    if (!carrierName) {
      toast.error("Por favor, informe a transportadora");
      return false;
    }
    
    if (!trackingNumber) {
      toast.error("Por favor, informe o número do conhecimento");
      return false;
    }
    
    if (!packages || parseInt(packages, 10) <= 0) {
      toast.error("Por favor, informe a quantidade de volumes");
      return false;
    }
    
    if (!weight || parseFloat(weight) <= 0) {
      toast.error("Por favor, informe o peso");
      return false;
    }
    
    if (!shipmentDate) {
      toast.error("Por favor, informe a data do embarque");
      return false;
    }
    
    return true;
  };
  
  const submitShipment = async (checkDuplicate = true) => {
    try {
      const packagesNum = parseInt(packages, 10);
      const weightNum = parseFloat(weight);
      
      if (checkDuplicate && checkDuplicateTrackingNumberForCompany(trackingNumber, companyId)) {
        setShowDuplicateAlert(true);
        return;
      }
      
      console.log('useShipmentFormSubmit - shipmentDate received:', shipmentDate);
      
      const newShipment = {
        companyId,
        companyName,
        transportMode,
        carrierName,
        trackingNumber,
        packages: packagesNum,
        weight: weightNum,
        arrivalDate: shipmentDate, // Usar shipmentDate diretamente já que vem em formato ISO correto
        status,
        isRetained: status === 'retained',
        ...(status === 'retained' && retentionReason && {
          fiscalActionData: {
            reason: retentionReason,
            amountToPay: retentionAmount ? parseFloat(retentionAmount) : 0,
            paymentDate,
            releaseDate,
            actionNumber,
            notes: fiscalNotes
          }
        })
      };
      
      console.log('useShipmentFormSubmit - shipment data to be sent:', newShipment);
      
      const shipment = await addShipment(newShipment);
      
      closeDialog();
      toast.success("Embarque criado com sucesso!");
      
      return shipment.id;
    } catch (error) {
      console.error("Error submitting shipment:", error);
      toast.error("Erro ao criar embarque");
      throw error;
    }
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    await submitShipment();
  };
  
  const handleConfirmDuplicate = async () => {
    await submitShipment(false);
    setShowDuplicateAlert(false);
  };
  
  return {
    showDuplicateAlert,
    setShowDuplicateAlert,
    handleSubmit,
    handleConfirmDuplicate
  };
}
