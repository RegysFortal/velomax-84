
import React from 'react';
import { RetentionInfoSection } from "./RetentionInfoSection";

interface LegacyRetentionWrapperProps {
  status: string;
  retainedDocsCount: number;
  actionNumber?: string;
  retentionReason: string;
  retentionAmount: string;
  paymentDate?: string;
  releaseDate?: string;
  fiscalNotes?: string;
  onEditClick: () => void;
}

export function LegacyRetentionWrapper({
  status,
  retainedDocsCount,
  actionNumber,
  retentionReason,
  retentionAmount,
  paymentDate,
  releaseDate,
  fiscalNotes,
  onEditClick
}: LegacyRetentionWrapperProps) {
  // Only show legacy retention info if the shipment status is retained but no individual docs are retained
  if (status !== "retained" || retainedDocsCount > 0) {
    return null;
  }
  
  return (
    <RetentionInfoSection
      actionNumber={actionNumber}
      retentionReason={retentionReason}
      retentionAmount={retentionAmount}
      paymentDate={paymentDate}
      releaseDate={releaseDate}
      fiscalNotes={fiscalNotes}
      onEditClick={onEditClick}
    />
  );
}
