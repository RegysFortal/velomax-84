
import { useState, useEffect } from 'react';
import { useShipments } from '@/contexts/shipments';
import { useShipmentFormSubmit } from './useShipmentFormSubmit';
import { Client } from '@/types';
import { ShipmentStatus, TransportMode } from '@/types/shipment';

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
  
  // Form state
  const [isFormReady, setIsFormReady] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [transportMode, setTransportMode] = useState<TransportMode>('air');
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packages, setPackages] = useState('');
  const [weight, setWeight] = useState('');
  const [arrivalFlight, setArrivalFlight] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [observations, setObservations] = useState('');
  const [status, setStatus] = useState<ShipmentStatus>('pending');
  const [retentionReason, setRetentionReason] = useState('');
  const [retentionAmount, setRetentionAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [actionNumber, setActionNumber] = useState('');
  const [fiscalNotes, setFiscalNotes] = useState('');

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
    checkDuplicateTrackingNumberForCompany,
    closeDialog: onClose
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setIsFormReady(true);
    } else {
      // Reset form state when dialog closes
      setCompanyId('');
      setCompanyName('');
      setTransportMode('air');
      setCarrierName('');
      setTrackingNumber('');
      setPackages('');
      setWeight('');
      setArrivalFlight('');
      setArrivalDate('');
      setObservations('');
      setStatus('pending');
      setRetentionReason('');
      setRetentionAmount('');
      setPaymentDate('');
      setReleaseDate('');
      setActionNumber('');
      setFiscalNotes('');
      setIsFormReady(false);
    }
  }, [open]);

  return {
    isFormReady,
    companyId,
    setCompanyId,
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
    showDuplicateAlert,
    setShowDuplicateAlert,
    handleSubmit,
    handleConfirmDuplicate
  };
}
