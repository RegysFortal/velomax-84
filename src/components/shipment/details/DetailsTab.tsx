
import React from 'react';
import { Shipment } from "@/types/shipment";
import { StatusActions } from "./StatusActions";
import { Separator } from "@/components/ui/separator";
import { useShipmentDetails } from "./useShipmentDetails";
import { GeneralInfoSection } from "./sections/GeneralInfoSection";
import { CargoDetailsSection } from "./sections/CargoDetailsSection";
import { RetentionInfoSection } from "./sections/RetentionInfoSection";
import { DeliveryInfoSection } from "./sections/DeliveryInfoSection";
import { ObservationsSection } from "./sections/ObservationsSection";
import { ActionButtonsSection } from "./sections/ActionButtonsSection";
import { RetentionSheetContainer } from "./containers/RetentionSheetContainer";
import { useRetentionSheetState } from "./hooks/useRetentionSheetState";

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

  // Convert packages and weight strings to numbers
  const packagesNumber = parseInt(packages, 10);
  const weightNumber = parseFloat(weight);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GeneralInfoSection
          companyName={companyName}
          transportMode={transportMode}
          carrierName={carrierName}
          trackingNumber={trackingNumber}
        />
        
        <CargoDetailsSection
          packages={packagesNumber}
          weight={weightNumber}
          transportMode={transportMode}
          arrivalFlight={arrivalFlight}
          arrivalDate={arrivalDate}
        />
        
        <StatusActions 
          status={status} 
          shipmentId={shipment.id} 
          onStatusChange={handleStatusChange}
        />
      </div>
      
      <Separator />
      
      {/* Retenção Fiscal (se aplicável) */}
      {status === "retained" && (
        <RetentionInfoSection
          actionNumber={actionNumber}
          retentionReason={retentionReason}
          retentionAmount={retentionAmount}
          paymentDate={paymentDate}
          releaseDate={releaseDate}
          fiscalNotes={fiscalNotes}
          onEditClick={handleEditClick}
        />
      )}
      
      {/* Informações de Entrega (se aplicável) */}
      {status === "delivered_final" && (
        <DeliveryInfoSection
          receiverName={receiverName}
          deliveryDate={deliveryDate}
          deliveryTime={deliveryTime}
        />
      )}
      
      {/* Observações */}
      {observations && (
        <ObservationsSection observations={observations} />
      )}
      
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
