
import { useState } from 'react';
import { Shipment } from '@/types/shipment';

export function useShipmentState(shipment: Shipment) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [companyId, setCompanyId] = useState(shipment.companyId);
  const [companyName, setCompanyName] = useState(shipment.companyName);
  const [transportMode, setTransportMode] = useState(shipment.transportMode);
  const [carrierName, setCarrierName] = useState(shipment.carrierName);
  const [trackingNumber, setTrackingNumber] = useState(shipment.trackingNumber);
  const [packages, setPackages] = useState(shipment.packages.toString());
  const [weight, setWeight] = useState(shipment.weight.toString());
  const [arrivalFlight, setArrivalFlight] = useState(shipment.arrivalFlight || "");
  const [arrivalDate, setArrivalDate] = useState(shipment.arrivalDate || "");
  const [status, setStatus] = useState(shipment.status);
  const [observations, setObservations] = useState(shipment.observations || "");
  const [deliveryDate, setDeliveryDate] = useState(shipment.deliveryDate || "");
  const [deliveryTime, setDeliveryTime] = useState(shipment.deliveryTime || "");
  const [receiverName, setReceiverName] = useState(shipment.receiverName || "");
  const [retentionReason, setRetentionReason] = useState(shipment.fiscalAction?.reason || "");
  const [retentionAmount, setRetentionAmount] = useState(shipment.fiscalAction?.amountToPay?.toString() || "");
  const [paymentDate, setPaymentDate] = useState(shipment.fiscalAction?.paymentDate || "");
  const [releaseDate, setReleaseDate] = useState(shipment.fiscalAction?.releaseDate || "");
  const [actionNumber, setActionNumber] = useState(shipment.fiscalAction?.actionNumber || "");
  const [fiscalNotes, setFiscalNotes] = useState(shipment.fiscalAction?.notes || "");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCompanyId(shipment.companyId);
    setCompanyName(shipment.companyName);
    setTransportMode(shipment.transportMode);
    setCarrierName(shipment.carrierName);
    setTrackingNumber(shipment.trackingNumber);
    setPackages(shipment.packages.toString());
    setWeight(shipment.weight.toString());
    setArrivalFlight(shipment.arrivalFlight || "");
    setArrivalDate(shipment.arrivalDate || "");
    setStatus(shipment.status);
    setObservations(shipment.observations || "");
    setDeliveryDate(shipment.deliveryDate || "");
    setDeliveryTime(shipment.deliveryTime || "");
    setReceiverName(shipment.receiverName || "");
    setRetentionReason(shipment.fiscalAction?.reason || "");
    setRetentionAmount(shipment.fiscalAction?.amountToPay?.toString() || "");
    setPaymentDate(shipment.fiscalAction?.paymentDate || "");
    setReleaseDate(shipment.fiscalAction?.releaseDate || "");
    setActionNumber(shipment.fiscalAction?.actionNumber || "");
    setFiscalNotes(shipment.fiscalAction?.notes || "");
  };

  return {
    isEditing, setIsEditing,
    deleteAlertOpen, setDeleteAlertOpen,
    companyId, setCompanyId,
    companyName, setCompanyName,
    transportMode, setTransportMode,
    carrierName, setCarrierName,
    trackingNumber, setTrackingNumber,
    packages, setPackages,
    weight, setWeight,
    arrivalFlight, setArrivalFlight,
    arrivalDate, setArrivalDate,
    status, setStatus,
    observations, setObservations,
    deliveryDate, setDeliveryDate,
    deliveryTime, setDeliveryTime,
    receiverName, setReceiverName,
    retentionReason, setRetentionReason,
    retentionAmount, setRetentionAmount,
    paymentDate, setPaymentDate,
    releaseDate, setReleaseDate,
    actionNumber, setActionNumber,
    fiscalNotes, setFiscalNotes,
    handleEditClick, handleCancelEdit
  };
}
