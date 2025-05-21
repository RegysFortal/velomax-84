
import React from 'react';
import { Document } from "@/types/shipment";
import { Card } from "@/components/ui/card";
import { DocumentHeader } from './components/DocumentHeader';
import { DocumentDetails } from './components/DocumentDetails';
import { RetentionInfo } from './components/RetentionInfo';
import { DocumentActions } from './components/DocumentActions';

interface DocumentItemProps {
  document: Document;
  shipmentId: string;
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
  onStatusChange?: () => void;
}

export function DocumentItem({ 
  document, 
  shipmentId, 
  onEdit, 
  onDelete,
  onStatusChange
}: DocumentItemProps) {
  // Determine if we should show priority background
  const shouldShowPriorityBackground = document.isPriority && !document.isDelivered;

  return (
    <Card className={`p-4 ${shouldShowPriorityBackground ? 'bg-red-50 border-red-200' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <DocumentHeader 
            document={document}
            shipmentId={shipmentId}
            shouldShowPriorityBackground={shouldShowPriorityBackground}
            onStatusChange={onStatusChange}
          />
          
          <DocumentDetails 
            document={document}
            shouldShowPriorityBackground={shouldShowPriorityBackground}
          />
          
          {/* Informações de Retenção (quando aplicável) */}
          {document.isRetained && (
            <RetentionInfo
              document={document}
              shouldShowPriorityBackground={shouldShowPriorityBackground}
            />
          )}
        </div>
        
        <DocumentActions
          document={document}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </Card>
  );
}
