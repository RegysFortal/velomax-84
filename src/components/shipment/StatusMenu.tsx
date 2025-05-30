
import React from 'react';
import { useStatusMenu } from "./hooks/useStatusMenu";
import { StatusBadge } from "./StatusBadge";
import { ShipmentStatus } from "@/types/shipment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeliveryDialog } from "./dialogs/DeliveryDialog";
import { RetentionSheet } from "./dialogs/RetentionSheet";
import { StatusMenuItems } from "./StatusMenuItems";
import { DocumentSelectionDialog } from "./dialogs/DocumentSelectionDialog";
import { useShipments } from "@/contexts/shipments";

interface StatusMenuProps {
  shipmentId: string;
  status: ShipmentStatus;
  showLabel?: boolean;
  className?: string;
  onStatusChange?: () => void;
}

export function StatusMenu({ 
  shipmentId, 
  status, 
  showLabel = true,
  className,
  onStatusChange
}: StatusMenuProps) {
  const { getShipmentById } = useShipments();
  const shipment = getShipmentById(shipmentId);
  
  // Count documents and delivered documents if available
  const documentCount = shipment?.documents?.length || 0;
  const deliveredDocumentCount = shipment?.documents?.filter(doc => doc.isDelivered)?.length || 0;
  
  // Automatically update badge if partial delivery condition is met
  let displayStatus = status;
  if (documentCount > 1 && deliveredDocumentCount > 0 && deliveredDocumentCount < documentCount) {
    displayStatus = "partially_delivered";
  }
  
  const {
    // Dialog state
    showDocumentSelection,
    setShowDocumentSelection,
    showDeliveryDialog,
    setShowDeliveryDialog,
    showRetentionSheet,
    setShowRetentionSheet,
    
    // Document selection state
    selectedDocumentIds,
    setSelectedDocumentIds,
    
    // Delivery form state
    receiverName,
    setReceiverName,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    
    // Retention form state
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
    
    // Action handlers
    handleStatusChange,
    handleDeliveryConfirm,
    handleRetentionConfirm,
    getStatusLabel
  } = useStatusMenu({ 
    shipmentId, 
    status: displayStatus, // Use the potentially modified status
    onStatusChange 
  });

  // Handler for document selection confirmation
  const handleDocumentSelectionContinue = (documentIds: string[]) => {
    setSelectedDocumentIds(documentIds);
    setShowDocumentSelection(false);
    
    // If we're changing to retained status, show retention sheet
    if (status === "in_transit" || status === "delivered") {
      setShowRetentionSheet(true);
    } else {
      // For other statuses like delivery, show delivery dialog
      setShowDeliveryDialog(true);
    }
  };
  
  // Handler for cancellation of document selection
  const handleDocumentSelectionCancel = () => {
    setSelectedDocumentIds([]);
    setShowDocumentSelection(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            <StatusBadge status={displayStatus} showLabel={showLabel} className={className} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          <StatusMenuItems 
            status={displayStatus}
            onStatusChange={handleStatusChange} 
          />
        </DropdownMenuContent>
      </DropdownMenu>

      {shipment && (
        <DocumentSelectionDialog
          open={showDocumentSelection}
          onOpenChange={setShowDocumentSelection}
          documents={shipment.documents || []}
          onContinue={handleDocumentSelectionContinue}
          onCancel={handleDocumentSelectionCancel}
        />
      )}

      <DeliveryDialog
        open={showDeliveryDialog}
        onOpenChange={setShowDeliveryDialog}
        receiverName={receiverName}
        setReceiverName={setReceiverName}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
        onConfirm={handleDeliveryConfirm}
      />

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
        onConfirm={handleRetentionConfirm}
      />
    </>
  );
}
