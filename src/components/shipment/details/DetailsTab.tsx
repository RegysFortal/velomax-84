
import React, { useEffect } from 'react';
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
import { DocumentsList } from "../DocumentsList";
import { Card } from "@/components/ui/card";
import { AlertTriangle, FileText } from "lucide-react";
import { DocumentItem } from "../DocumentItem";

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

  // Calculate document stats
  const retainedDocsCount = shipment.documents ? shipment.documents.filter(doc => doc.isRetained).length : 0;
  const deliveredDocsCount = shipment.documents ? shipment.documents.filter(doc => doc.isDelivered).length : 0;
  const totalDocsCount = shipment.documents ? shipment.documents.length : 0;
  
  // Filtrar documentos retidos
  const retainedDocuments = shipment.documents ? shipment.documents.filter(doc => doc.isRetained) : [];
  
  // Handle document status change
  const handleDocumentStatusChange = () => {
    // We need to refresh the shipment data to see the updated document statuses
    setTimeout(() => {
      window.dispatchEvent(new Event('deliveries-updated'));
    }, 500);
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
      
      {/* Document Status Section */}
      <div>
        <DocumentsList
          shipmentId={shipment.id}
          documents={shipment.documents || []}
          onStatusChange={handleDocumentStatusChange}
        />
      </div>
      
      <Separator />
      
      {/* Document Status Summary */}
      {totalDocsCount > 0 && (
        <div className={`${retainedDocsCount > 0 ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"} rounded-md p-4`}>
          <h3 className={`${retainedDocsCount > 0 ? "text-amber-800" : "text-green-800"} font-medium mb-1`}>
            Status dos Documentos
          </h3>
          <p className={`${retainedDocsCount > 0 ? "text-amber-700" : "text-green-700"}`}>
            {retainedDocsCount > 0 
              ? `Este embarque possui ${retainedDocsCount} ${retainedDocsCount === 1 ? 'documento pendente' : 'documentos pendentes'} de um total de ${totalDocsCount}.`
              : `Todos os ${totalDocsCount} documentos deste embarque foram entregues.`}
            {deliveredDocsCount > 0 && retainedDocsCount > 0 && 
              ` ${deliveredDocsCount} ${deliveredDocsCount === 1 ? 'documento já foi entregue' : 'documentos já foram entregues'}.`}
          </p>
        </div>
      )}
      
      {/* Documentos Retidos (se houver) */}
      {retainedDocuments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-amber-800">Documentos Retidos</h3>
          <div className="space-y-2">
            {retainedDocuments.map(doc => (
              <DocumentItem
                key={doc.id}
                document={doc}
                shipmentId={shipment.id}
                onEdit={() => {}}
                onDelete={() => {}}
                onStatusChange={handleDocumentStatusChange}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Retenção Fiscal (se aplicável para o embarque como um todo - legado) */}
      {status === "retained" && retainedDocuments.length === 0 && (
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
