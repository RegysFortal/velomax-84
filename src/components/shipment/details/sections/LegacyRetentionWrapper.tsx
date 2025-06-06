
import React from 'react';
import { RetentionInfo } from "../../document/components/RetentionInfo";
import { Document } from "@/types/shipment";

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
  
  // Create a mock document with retention info to use with RetentionInfo component
  const mockDocument: Document = {
    id: "legacy-retention",
    name: "Retenção do Embarque",
    type: "other",
    status: "retained",
    isRetained: true,
    notes: JSON.stringify({
      actionNumber,
      reason: retentionReason,
      amount: retentionAmount,
      paymentDate,
      releaseDate,
      notes: fiscalNotes
    }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Informações da Retenção</h3>
        <button 
          onClick={onEditClick}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Editar Informações de Retenção
        </button>
      </div>
      
      <RetentionInfo 
        document={mockDocument} 
        shouldShowPriorityBackground={false} 
      />
    </div>
  );
}
