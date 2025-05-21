
import React, { useState, useEffect } from 'react';
import { Siren } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useShipments } from '@/contexts/shipments';
import { Link } from 'react-router-dom';

export interface PriorityDocument {
  id: string;
  minuteNumber: string;
  shipmentId: string;
  companyName: string;
  invoiceNumbers?: string[];
  notes?: string; // Added notes field
}

export const PriorityDocumentsAlert = () => {
  const [dismissed, setDismissed] = useState(false);
  const [priorityDocuments, setPriorityDocuments] = useState<PriorityDocument[]>([]);
  const { shipments } = useShipments();

  // Find all priority documents
  useEffect(() => {
    const priority: PriorityDocument[] = [];
    
    shipments.forEach(shipment => {
      shipment.documents.forEach(doc => {
        if (doc.isPriority) {
          priority.push({
            id: doc.id,
            minuteNumber: doc.minuteNumber || 'Sem número',
            shipmentId: shipment.id,
            companyName: shipment.companyName,
            invoiceNumbers: doc.invoiceNumbers,
            notes: doc.notes // Include the document notes
          });
        }
      });
    });
    
    setPriorityDocuments(priority);
  }, [shipments]);
  
  // If no priority documents or alert dismissed, don't show anything
  if (priorityDocuments.length === 0 || dismissed) {
    return null;
  }
  
  return (
    <div className="animate-pulse mb-6">
      <Alert variant="destructive" className="bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-800">
        <Siren className="h-5 w-5 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-700 dark:text-red-300 font-semibold">
          Documentos Prioritários! ({priorityDocuments.length})
        </AlertTitle>
        <AlertDescription className="text-red-600 dark:text-red-200">
          <div className="mt-2 max-h-32 overflow-y-auto">
            {priorityDocuments.map((doc) => (
              <div key={doc.id} className="mb-1">
                <Link 
                  to={`/shipments/${doc.shipmentId}`} 
                  className="hover:underline"
                >
                  <span className="font-medium">{doc.companyName}</span> - 
                  Minuta: {doc.minuteNumber}
                  {doc.invoiceNumbers && doc.invoiceNumbers.length > 0 && (
                    <span> - NF: {doc.invoiceNumbers.join(', ')}</span>
                  )}
                  {doc.notes && (
                    <div className="ml-4 text-sm italic">
                      Obs: {doc.notes}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
              onClick={() => setDismissed(true)}
            >
              Fechar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
