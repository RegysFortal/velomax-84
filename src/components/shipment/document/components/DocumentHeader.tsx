
import React from 'react';
import { FileText } from "lucide-react";
import { Document } from "@/types/shipment";
import { DocumentStatusControl } from "../../DocumentStatusControl";
import { PriorityButton } from './PriorityButton';

interface DocumentHeaderProps {
  document: Document;
  shipmentId: string;
  shouldShowPriorityBackground: boolean;
  onStatusChange?: () => void;
}

export function DocumentHeader({ 
  document, 
  shipmentId, 
  shouldShowPriorityBackground,
  onStatusChange 
}: DocumentHeaderProps) {
  return (
    <div className="flex items-center">
      <FileText className={`h-4 w-4 mr-2 ${shouldShowPriorityBackground ? 'text-red-500' : 'text-blue-500'}`} />
      <h4 className={`font-medium ${shouldShowPriorityBackground ? 'text-red-700' : ''}`}>
        {document.minuteNumber ? `Minuta: ${document.minuteNumber}` : document.name}
      </h4>
      <PriorityButton 
        document={document}
        shipmentId={shipmentId}
        onStatusChange={onStatusChange}
      />
      <div className="ml-2">
        <DocumentStatusControl 
          shipmentId={shipmentId} 
          document={document} 
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}
