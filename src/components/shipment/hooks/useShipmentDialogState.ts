
import { useState, useEffect } from 'react';
import { ShipmentStatus, TransportMode } from '@/types/shipment';
import { useShipmentFormSubmit } from './useShipmentFormSubmit';
import { useShipments } from '@/contexts/shipments';
import { Client } from '@/types';

interface UseShipmentDialogStateProps {
  clients: Client[];
  onClose: () => void;
  open: boolean;
}

export function useShipmentDialogState({ clients, onClose, open }: UseShipmentDialogStateProps) {
  const { addShipment, checkDuplicateTrackingNumber } = useShipments();
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
  
  // Retention data
  const [retentionReason, setRetentionReason] = useState("");
  const [retentionAmount, setRetentionAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [actionNumber, setActionNumber] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [fiscalNotes, setFiscalNotes] = useState("");
  
  // Initialize form submission hook
  const { 
    showDuplicateAlert,
    setShowDuplicateAlert,
    handleSubmit,
    handleConfirmDuplicate
  } = useShipmentFormSubmit({
    companyId,
    companyName,
    transportMode,
    carrierName,
    trackingNumber,
    packages,
    weight,
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
    closeDialog: onClose
  });
  
  // Delay form initialization to prevent UI freezing
  useEffect(() => {
    if (open) {
      setIsFormReady(false);
      const timer = setTimeout(() => {
        setIsFormReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return {
    // Form state
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
    observations,
    setObservations,
    status,
    setStatus,
    
    // Retention data
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    actionNumber,
    setActionNumber,
    releaseDate,
    setReleaseDate,
    fiscalNotes,
    setFiscalNotes,
    
    // UI state
    isFormReady,
    
    // Alert state
    showDuplicateAlert,
    setShowDuplicateAlert,
    
    // Actions
    handleSubmit,
    handleConfirmDuplicate
  };
}
