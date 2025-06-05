
import React from 'react';
import { Package } from "lucide-react";
import { Document } from "@/types/shipment";

interface DocumentDetailsProps {
  document: Document;
  shouldShowPriorityBackground: boolean;
}

export function DocumentDetails({ document, shouldShowPriorityBackground }: DocumentDetailsProps) {
  return (
    <div>
      {/* Display invoice numbers if available */}
      {document.invoiceNumbers && document.invoiceNumbers.length > 0 && (
        <div className={`text-sm ${shouldShowPriorityBackground ? 'text-red-600' : 'text-muted-foreground'} mt-1 font-medium`}>
          Nota(s) Fiscal(is): {document.invoiceNumbers.join(', ')}
        </div>
      )}
      
      <div className="mt-2 space-y-1">
        <div className={`flex items-center space-x-4 text-sm ${shouldShowPriorityBackground ? 'text-red-600' : ''}`}>
          {document.packages !== undefined && (
            <div className="flex items-center">
              <Package className="h-3 w-3 mr-1" />
              {document.packages} volumes
            </div>
          )}
          
          {document.weight !== undefined && (
            <div>
              {document.weight} kg
            </div>
          )}
        </div>
        
        {document.notes && (
          <div className={`text-sm ${shouldShowPriorityBackground ? 'text-red-600' : 'text-muted-foreground'}`}>
            {document.notes}
          </div>
        )}
      </div>
    </div>
  );
}
