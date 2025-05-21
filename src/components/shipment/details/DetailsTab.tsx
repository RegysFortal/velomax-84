
import React, { useEffect } from 'react';
import { Shipment } from "@/types/shipment";
import { Separator } from "@/components/ui/separator";
import { useShipmentDetails } from "./useShipmentDetails";
import { RetentionSheetContainer } from "./containers/RetentionSheetContainer";
import { useRetentionSheetState } from "./hooks/useRetentionSheetState";
import { ActionButtonsSection } from "./sections/ActionButtonsSection";
import { ShipmentInfoGrid } from "./sections/ShipmentInfoGrid";
import { DocumentsSection } from "./sections/DocumentsSection";
import { LegacyRetentionWrapper } from "./sections/LegacyRetentionWrapper";
import { DeliveryAndObservationsWrapper } from "./sections/DeliveryAndObservationsWrapper";

interface DetailsTabProps {
  shipment: Shipment;
  onClose: () => void;
}

export default function DetailsTab({ shipment, onClose }: DetailsTabProps) {
  const {
    deleteAlertOpen,
    setDeleteAlertOpen,
    companyName,
    transportMode,
    carrierName,
    trackingNumber,
    packages,
    weight,
    arrivalFlight,
    arrivalDate,
    status,
    observations,
    deliveryDate,
    deliveryTime,
    receiverName,
    retentionReason,
    setRetentionReason,
    retentionAmount,
    setRetentionAmount,
    paymentDate,
    setPaymentDate,
    releaseDate,
    setReleaseDate,
    actionNumber,
    setActionNumber,
    fiscalNotes,
    setFiscalNotes,
    handleDelete,
    handleStatusChange
  } = useShipmentDetails(shipment, onClose);

  // Use the retention sheet state hook
  const { 
    showRetentionSheet, 
    setShowRetentionSheet, 
    handleEditClick, 
    handleRetentionUpdate 
  } = useRetentionSheetState(
    shipment.id, 
    actionNumber, 
    retentionReason, 
    retentionAmount, 
    paymentDate, 
    releaseDate, 
    fiscalNotes
  );

  // Handle document status change
  const handleDocumentStatusChange = () => {
    // We need to refresh the shipment data to see the updated document statuses
    setTimeout(() => {
      window.dispatchEvent(new Event('deliveries-updated'));
    }, 500);
  };

  // Calculate retained documents count for LegacyRetentionWrapper
  const retainedDocsCount = shipment.documents ? shipment.documents.filter(doc => doc.isRetained).length : 0;

  // Convert packages and weight strings to numbers
  const packagesNumber = parseInt(packages, 10);
  const weightNumber = parseFloat(weight);

  return (
    <div className="space-y-6">
      <ShipmentInfoGrid
        companyName={companyName}
        transportMode={transportMode}
        carrierName={carrierName}
        trackingNumber={trackingNumber}
        packages={packagesNumber}
        weight={weightNumber}
        arrivalFlight={arrivalFlight}
        arrivalDate={arrivalDate}
        status={status}
        shipmentId={shipment.id}
        onStatusChange={handleStatusChange}
      />
      
      <Separator />
      
      <DocumentsSection 
        shipment={shipment} 
        onDocumentStatusChange={handleDocumentStatusChange} 
      />
      
      <Separator />
      
      <LegacyRetentionWrapper 
        status={status}
        retainedDocsCount={retainedDocsCount}
        actionNumber={actionNumber}
        retentionReason={retentionReason}
        retentionAmount={retentionAmount}
        paymentDate={paymentDate}
        releaseDate={releaseDate}
        fiscalNotes={fiscalNotes}
        onEditClick={handleEditClick}
      />
      
      <DeliveryAndObservationsWrapper
        status={status}
        receiverName={receiverName}
        deliveryDate={deliveryDate}
        deliveryTime={deliveryTime}
        observations={observations}
      />
      
      {/* Retention Sheet Container */}
      <RetentionSheetContainer
        open={showRetentionSheet}
        onOpenChange={setShowRetentionSheet}
        actionNumber={actionNumber}
        setActionNumber={setActionNumber}
        retentionReason={retentionReason}
        setRetentionReason={setRetentionReason}
        retentionAmount={retentionAmount}
        setRetentionAmount={setRetentionAmount}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        releaseDate={releaseDate}
        setReleaseDate={setReleaseDate}
        fiscalNotes={fiscalNotes}
        setFiscalNotes={setFiscalNotes}
        onUpdate={handleRetentionUpdate}
        shipmentId={shipment.id}
        isEditing={true}
      />
      
      {/* Action Buttons */}
      <ActionButtonsSection
        deleteAlertOpen={deleteAlertOpen}
        setDeleteAlertOpen={setDeleteAlertOpen}
        onDelete={handleDelete}
      />
    </div>
  );
}
