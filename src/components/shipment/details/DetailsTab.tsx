
import React from 'react';
import { Shipment } from "@/types/shipment";
import { Client } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShipmentFormSection } from "../ShipmentFormSection";
import { RetentionFormSection } from "../RetentionFormSection";
import { StatusActions } from "./StatusActions";
import { ActionButtons } from "./ActionButtons";

interface DetailsTabProps {
  shipment: Shipment;
  formState: ReturnType<typeof import('./useShipmentDetails').useShipmentDetails>;
  clients: Client[];
}

export function DetailsTab({ shipment, formState, clients }: DetailsTabProps) {
  const {
    isEditing,
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
    releaseDate,
    setReleaseDate,
    actionNumber,
    setActionNumber,
    fiscalNotes,
    setFiscalNotes,
    handleEditClick,
    handleCancelEdit,
    handleSave,
    handleDelete,
    handleStatusChange
  } = formState;
  
  return (
    <div className="space-y-4">
      <ActionButtons 
        isEditing={isEditing}
        onEdit={handleEditClick}
        onCancel={handleCancelEdit}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      
      <ScrollArea className="max-h-[calc(95vh-230px)] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ShipmentFormSection 
            companyId={companyId}
            setCompanyId={setCompanyId}
            setCompanyName={setCompanyName}
            transportMode={transportMode}
            setTransportMode={setTransportMode}
            carrierName={carrierName}
            setCarrierName={setCarrierName}
            trackingNumber={trackingNumber}
            setTrackingNumber={setTrackingNumber}
            packages={packages}
            setPackages={setPackages}
            weight={weight}
            setWeight={setWeight}
            arrivalFlight={arrivalFlight}
            setArrivalFlight={setArrivalFlight}
            arrivalDate={arrivalDate}
            setArrivalDate={setArrivalDate}
            observations={observations}
            setObservations={setObservations}
            status={status}
            setStatus={setStatus}
            clients={clients}
            disabled={!isEditing}
            shipmentId={shipment.id}
          />
          
          {status === "retained" && isEditing && (
            <RetentionFormSection 
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
            />
          )}
          
          <StatusActions 
            status={status}
            onStatusChange={handleStatusChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
