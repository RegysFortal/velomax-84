
import React from "react";
import { RetentionSheet } from "../../dialogs/RetentionSheet";
import { useRetentionConfirm } from "../../hooks/useRetentionConfirm";

interface RetentionSheetContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionNumber: string;
  setActionNumber: (value: string) => void;
  retentionReason: string;
  setRetentionReason: (value: string) => void;
  retentionAmount: string;
  setRetentionAmount: (value: string) => void;
  paymentDate: string;
  setPaymentDate: (value: string) => void;
  releaseDate: string;
  setReleaseDate: (value: string) => void;
  fiscalNotes: string;
  setFiscalNotes: (value: string) => void;
  onUpdate: (
    actionNumber: string,
    retentionReason: string,
    retentionAmount: string,
    paymentDate: string,
    releaseDate: string,
    fiscalNotes: string
  ) => void;
  shipmentId: string;
  isEditing?: boolean;
}

export const RetentionSheetContainer: React.FC<RetentionSheetContainerProps> = ({
  open,
  onOpenChange,
  actionNumber,
  setActionNumber,
  retentionReason,
  setRetentionReason,
  retentionAmount,
  setRetentionAmount,
  paymentDate,
  setPaymentDate,
  releaseDate,
  setReleaseDate,
  fiscalNotes,
  setFiscalNotes,
  onUpdate,
  shipmentId,
  isEditing = true
}) => {
  // Use the retention confirm hook directly
  const { handleRetentionUpdate } = useRetentionConfirm({
    shipmentId,
    retentionReason,
    retentionAmount,
    paymentDate,
    releaseDate,
    actionNumber,
    fiscalNotes,
    resetForm: () => {
      // This function can be empty or reset form if needed
    }
  });

  const handleConfirm = async () => {
    console.log("RetentionSheetContainer - handleConfirm called with isEditing:", isEditing);
    
    if (isEditing) {
      // Use the direct update method from the hook
      const success = await handleRetentionUpdate();
      if (success) {
        onOpenChange(false);
        
        // Also call the parent's onUpdate to ensure UI is updated
        onUpdate(
          actionNumber,
          retentionReason,
          retentionAmount,
          paymentDate,
          releaseDate,
          fiscalNotes
        );
      }
    } else {
      // For new retentions, call the parent's onUpdate
      onUpdate(
        actionNumber,
        retentionReason,
        retentionAmount,
        paymentDate,
        releaseDate,
        fiscalNotes
      );
    }
  };

  return (
    <RetentionSheet
      open={open}
      onOpenChange={onOpenChange}
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
      onConfirm={handleConfirm}
      isEditing={isEditing}
    />
  );
}
