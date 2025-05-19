
import React from "react";
import { RetentionSheet } from "../../dialogs/RetentionSheet";

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
  isEditing = true
}) => {
  const handleConfirm = () => {
    onUpdate(
      actionNumber,
      retentionReason,
      retentionAmount,
      paymentDate,
      releaseDate,
      fiscalNotes
    );
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
};
