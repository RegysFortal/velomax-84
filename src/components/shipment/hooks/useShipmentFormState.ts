
import { useState } from 'react';
import { ShipmentStatus, TransportMode } from '@/types/shipment';

export function useShipmentFormState() {
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [transportMode, setTransportMode] = useState<TransportMode>("air");
  const [carrierName, setCarrierName] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [packages, setPackages] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [arrivalFlight, setArrivalFlight] = useState<string>("");
  const [arrivalDate, setArrivalDate] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [status, setStatus] = useState<ShipmentStatus>("in_transit");
  const [retentionReason, setRetentionReason] = useState<string>("");
  const [retentionAmount, setRetentionAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [actionNumber, setActionNumber] = useState<string>("");
  const [fiscalNotes, setFiscalNotes] = useState<string>("");
  
  const resetForm = () => {
    setCompanyId("");
    setCompanyName("");
    setTransportMode("air");
    setCarrierName("");
    setTrackingNumber("");
    setPackages("");
    setWeight("");
    setArrivalFlight("");
    setArrivalDate("");
    setObservations("");
    setStatus("in_transit");
    setRetentionReason("");
    setRetentionAmount("");
    setPaymentDate("");
    setReleaseDate("");
    setActionNumber("");
    setFiscalNotes("");
  };

  return {
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
    resetForm
  };
}
