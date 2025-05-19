
import React from "react";
import { DocumentSelectionDialog } from "../dialogs/DocumentSelectionDialog";
import { DeliveryDialog } from "../dialogs/DeliveryDialog";
import { RetentionSheetContainer } from "./containers/RetentionSheetContainer";
import { Shipment } from "@/types/shipment";

interface StatusActionDialogsProps {
  shipment?: Shipment;
  showDocumentSelection: boolean;
  setShowDocumentSelection: (show: boolean) => void;
  showDeliveryDialog: boolean;
  setShowDeliveryDialog: (show: boolean) => void;
  showRetentionSheet: boolean;
  setShowRetentionSheet: (show: boolean) => void;
  selectedDocumentIds: string[];
  receiverName: string;
  setReceiverName: (name: string) => void;
  deliveryDate: string;
  setDeliveryDate: (date: string) => void;
  deliveryTime: string;
  setDeliveryTime: (time: string) => void;
  retentionReason: string;
  setRetentionReason: (reason: string) => void;
  retentionAmount: string;
  setRetentionAmount: (amount: string) => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  releaseDate: string;
  setReleaseDate: (date: string) => void;
  actionNumber: string;
  setActionNumber: (number: string) => void;
  fiscalNotes: string;
  setFiscalNotes: (notes: string) => void;
  onDeliveryConfirm: () => void;
  onRetentionConfirm: () => void;
  onDocumentSelectionContinue: (documentIds: string[]) => void;
  onDocumentSelectionCancel: () => void;
  isRetentionEditing?: boolean;
  shipmentId: string;
}

export function StatusActionDialogs({
  shipment,
  showDocumentSelection,
  setShowDocumentSelection,
  showDeliveryDialog,
  setShowDeliveryDialog,
  showRetentionSheet,
  setShowRetentionSheet,
  selectedDocumentIds,
  receiverName,
  setReceiverName,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
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
  onDeliveryConfirm,
  onRetentionConfirm,
  onDocumentSelectionContinue,
  onDocumentSelectionCancel,
  isRetentionEditing = false,
  shipmentId
}: StatusActionDialogsProps) {
  return (
    <>
      {shipment && (
        <DocumentSelectionDialog
          open={showDocumentSelection}
          onOpenChange={setShowDocumentSelection}
          documents={shipment.documents || []}
          onContinue={onDocumentSelectionContinue}
          onCancel={onDocumentSelectionCancel}
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
        onConfirm={onDeliveryConfirm}
      />
      
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
        onUpdate={onRetentionConfirm}
        isEditing={isRetentionEditing}
        shipmentId={shipmentId}
      />
    </>
  );
}
