
import React from 'react';
import { FileText } from "lucide-react";
import { Document } from "@/types/shipment";

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
    </div>
  );
}
