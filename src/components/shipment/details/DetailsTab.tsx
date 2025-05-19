
import React, { useState } from 'react';
import { Shipment } from "@/types/shipment";
import { StatusActions } from "./StatusActions";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useShipmentDetails } from "./useShipmentDetails";
import { RetentionSheet } from "../dialogs/RetentionSheet";
import { toast } from "sonner";
import { GeneralInfoSection } from "./sections/GeneralInfoSection";
import { CargoDetailsSection } from "./sections/CargoDetailsSection";
import { RetentionInfoSection } from "./sections/RetentionInfoSection";
import { DeliveryInfoSection } from "./sections/DeliveryInfoSection";
import { ObservationsSection } from "./sections/ObservationsSection";
import { DeleteAlertDialog } from "./sections/DeleteAlertDialog";

interface DetailsTabProps {
  shipment: Shipment;
  onClose: () => void;
}

export default function DetailsTab({ shipment, onClose }: DetailsTabProps) {
  const {
    isEditing,
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
    handleSave,
    handleDelete,
    handleStatusChange
  } = useShipmentDetails(shipment, onClose);

  // State to control retention sheet visibility for editing
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);

  // Determine if we're in retained status and should show edit button
  const showRetentionEditOption = status === 'retained';

  // Handler for edit button click
  const onEditRetentionClick = () => {
    setShowRetentionSheet(true);
  };

  // Handler for retention form submission
  const handleRetentionUpdate = async () => {
    try {
      await handleSave();
      setShowRetentionSheet(false);
    } catch (error) {
      console.error("Error updating retention details:", error);
      toast.error("Erro ao atualizar informações de retenção");
    }
  };

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
          onEditClick={onEditRetentionClick}
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
      
      {/* Retention Sheet for editing */}
      <RetentionSheet
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
        onConfirm={handleRetentionUpdate}
        isEditing={true}
      />
      
      {/* Ações do Embarque */}
      <div className="flex justify-end space-x-2">
        <Button variant="destructive" onClick={() => setDeleteAlertOpen(true)}>
          Excluir
        </Button>
      </div>
      
      {/* Diálogo de confirmação para exclusão */}
      <DeleteAlertDialog
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onDelete={handleDelete}
      />
    </div>
  );
}
