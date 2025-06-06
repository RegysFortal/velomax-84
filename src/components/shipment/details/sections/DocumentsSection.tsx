
import React from 'react';
import { Shipment, Document } from "@/types/shipment";
import { DocumentsList } from "../../DocumentsList";
import { DocumentItem } from "../../document";
import { Card } from "@/components/ui/card";
import { RetentionInfo } from "../../document/components/RetentionInfo";
import { DeliveryInfo } from "../../document/components/DeliveryInfo";
import { AlertTriangle } from "lucide-react";

interface DocumentsSectionProps {
  shipment: Shipment;
  onDocumentStatusChange: () => void;
}

export function DocumentsSection({ shipment, onDocumentStatusChange }: DocumentsSectionProps) {
  // Calculate document stats
  const retainedDocsCount = shipment.documents ? shipment.documents.filter(doc => doc.isRetained).length : 0;
  const deliveredDocsCount = shipment.documents ? shipment.documents.filter(doc => doc.isDelivered).length : 0;
  const totalDocsCount = shipment.documents ? shipment.documents.length : 0;
  
  // Filtrar documentos retidos
  const retainedDocuments = shipment.documents ? shipment.documents.filter(doc => doc.isRetained) : [];
  
  return (
    <>
      {/* Document Status Section */}
      <div>
        <DocumentsList
          shipmentId={shipment.id}
          documents={shipment.documents || []}
          onStatusChange={onDocumentStatusChange}
        />
      </div>
      
      {/* Document Status Summary */}
      {totalDocsCount > 0 && (
        <div className={`${retainedDocsCount > 0 ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"} rounded-md p-4`}>
          <h3 className={`${retainedDocsCount > 0 ? "text-amber-800" : "text-green-800"} font-medium mb-1`}>
            Status dos Documentos
          </h3>
          <p className={`${retainedDocsCount > 0 ? "text-amber-700" : "text-green-700"}`}>
            {retainedDocsCount > 0 
              ? `Este embarque possui ${retainedDocsCount} ${retainedDocsCount === 1 ? 'documento pendente' : 'documentos pendentes'} de um total de ${totalDocsCount}.`
              : `Todos os ${totalDocsCount} documentos deste embarque foram entregues.`}
            {deliveredDocsCount > 0 && retainedDocsCount > 0 && 
              ` ${deliveredDocsCount} ${deliveredDocsCount === 1 ? 'documento já foi entregue' : 'documentos já foram entregues'}.`}
          </p>
        </div>
      )}
      
      {/* Documentos Retidos (se houver) */}
      {retainedDocuments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-amber-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Documentos Retidos
          </h3>
          <div className="space-y-2">
            {retainedDocuments.map(doc => (
              <Card key={doc.id} className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">
                      {doc.minuteNumber ? `Minuta: ${doc.minuteNumber}` : doc.name}
                    </span>
                  </div>
                </div>
                
                {/* Document details */}
                <div className="text-sm text-amber-700 space-y-1 mb-3">
                  {doc.invoiceNumbers && doc.invoiceNumbers.length > 0 && (
                    <div>
                      <strong>Notas Fiscais:</strong> {doc.invoiceNumbers.join(', ')}
                    </div>
                  )}
                  {doc.weight && (
                    <div><strong>Peso:</strong> {doc.weight} kg</div>
                  )}
                  {doc.packages && (
                    <div><strong>Volumes:</strong> {doc.packages}</div>
                  )}
                </div>

                {/* Retention Information using the same component */}
                <RetentionInfo 
                  document={doc} 
                  shouldShowPriorityBackground={false} 
                />

                {/* Delivery Information if delivered */}
                {doc.isDelivered && (
                  <DeliveryInfo 
                    document={doc} 
                    shipment={shipment}
                    shouldShowPriorityBackground={false} 
                  />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
