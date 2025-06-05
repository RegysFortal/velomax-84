
import { useState } from 'react';
import { ShipmentStatus, TransportMode } from '@/types/shipment';
import { toISODateString } from "@/utils/dateUtils";

export function useShipmentFormState() {
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [transportMode, setTransportMode] = useState<TransportMode>("air");
  const [carrierName, setCarrierName] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [packages, setPackages] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [shipmentDate, setShipmentDate] = useState<string>(toISODateString(new Date()));
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
    setShipmentDate(toISODateString(new Date()));
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
    actionNumber,
    setActionNumber,
    releaseDate,
    setReleaseDate,
    fiscalNotes,
    setFiscalNotes,
    resetForm
  };
}
