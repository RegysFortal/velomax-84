
import { useState, useEffect } from "react";
import { Client } from "@/types";
import { useShipmentFormState } from "./useShipmentFormState";
import { useShipmentFormSubmit } from "./useShipmentFormSubmit";
import { useShipments } from "@/contexts/shipments";

interface UseShipmentDialogStateProps {
  clients: Client[];
  onClose: () => void;
  open: boolean;
  checkDuplicateTrackingNumberForCompany: (trackingNumber: string, companyId: string) => boolean;
}

export function useShipmentDialogState({
  clients,
  onClose,
  open,
  checkDuplicateTrackingNumberForCompany
}: UseShipmentDialogStateProps) {
  const { addShipment } = useShipments();
  const [isFormReady, setIsFormReady] = useState(false);
  
  const formState = useShipmentFormState();
  
  const submitHook = useShipmentFormSubmit({
    companyId: formState.companyId,
    companyName: formState.companyName,
    transportMode: formState.transportMode,
    carrierName: formState.carrierName,
    trackingNumber: formState.trackingNumber,
    packages: formState.packages,
    weight: formState.weight,
    shipmentDate: formState.shipmentDate,
    status: formState.status,
    retentionReason: formState.retentionReason,
    retentionAmount: formState.retentionAmount,
    paymentDate: formState.paymentDate,
    releaseDate: formState.releaseDate,
    actionNumber: formState.actionNumber,
    fiscalNotes: formState.fiscalNotes,
    clients,
    addShipment,
    checkDuplicateTrackingNumberForCompany,
    closeDialog: onClose
  });

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsFormReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setIsFormReady(false);
      formState.resetForm();
    }
  }, [open, formState.resetForm]);

  return {
    ...formState,
    ...submitHook,
    isFormReady
  };
}
