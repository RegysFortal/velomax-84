
import React, { useState } from 'react';
import { Document, Shipment } from "@/types/shipment";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentRetentionForm } from "./DocumentRetentionForm";
import { DocumentDeliveryForm } from "./DocumentDeliveryForm";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { DocumentStatusControl } from "../DocumentStatusControl";
import { DeliveryInfo } from "../document/components/DeliveryInfo";
import { RetentionInfo } from "../document/components/RetentionInfo";

interface ExpandableDocumentsProps {
  shipment: Shipment;
  onDocumentUpdate: () => void;
}

export function ExpandableDocuments({ shipment, onDocumentUpdate }: ExpandableDocumentsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editMode, setEditMode] = useState<'retention' | 'delivery' | null>(null);

  // Debug log to see what documents we have
  console.log("ExpandableDocuments - Shipment documents:", shipment.documents);

  const priorityDocuments = shipment.documents?.filter(doc => doc.isPriority) || [];
  const totalDocuments = shipment.documents?.length || 0;

  const getStatusBadgeVariant = (document: Document) => {
    if (document.isDelivered) return 'default';
    if (document.isRetained) return 'destructive';
    if (document.isPickedUp) return 'outline';
    return 'secondary';
  };

  const getStatusLabel = (document: Document) => {
    if (document.isDelivered) return 'Entregue';
    if (document.isRetained) return 'Retido';
    if (document.isPickedUp) return 'Retirado';
    return 'Em Trânsito';
  };

  const closeEditMode = () => {
    setEditingDocument(null);
    setEditMode(null);
  };

  if (totalDocuments === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Documentos (0)</span>
        </div>
        <div className="mt-2 text-center text-gray-500 py-4">
          Nenhum documento encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span>Documentos ({totalDocuments})</span>
            {priorityDocuments.length > 0 && (
              <div className="flex items-center gap-1 ml-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-red-500 text-sm">({priorityDocuments.length} prioritários)</span>
              </div>
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          <div className="border rounded-md bg-gray-50 p-4 space-y-3">
            {shipment.documents && shipment.documents.length > 0 ? (
              shipment.documents.map((document) => (
                <div 
                  key={document.id} 
                  className={`border rounded-md p-3 bg-white ${document.isPriority ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {document.isPriority && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">
                          {document.minuteNumber ? `Minuta: ${document.minuteNumber}` : document.name}
                        </span>
                      </div>
                      
                      <Badge variant={getStatusBadgeVariant(document)}>
                        {getStatusLabel(document)}
                      </Badge>
                    </div>

                    <DocumentStatusControl
                      shipmentId={shipment.id}
                      document={document}
                      onStatusChange={onDocumentUpdate}
                    />
                  </div>
                  
                  {/* Document details */}
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    {document.invoiceNumbers && document.invoiceNumbers.length > 0 && (
                      <div>
                        <strong>Notas Fiscais:</strong> {document.invoiceNumbers.join(', ')}
                      </div>
                    )}
                    {document.weight && (
                      <div><strong>Peso:</strong> {document.weight} kg</div>
                    )}
                    {document.packages && (
                      <div><strong>Volumes:</strong> {document.packages}</div>
                    )}
                    {document.notes && (
                      <div><strong>Observações:</strong> {document.notes}</div>
                    )}
                  </div>

                  {/* Retention Information - Only show action number, reason, and amount */}
                  <RetentionInfo 
                    document={document} 
                    shouldShowPriorityBackground={document.isPriority || false} 
                  />

                  {/* Delivery Information - Only show receiver, date, and time */}
                  <DeliveryInfo 
                    document={document} 
                    shipment={shipment}
                    shouldShowPriorityBackground={document.isPriority || false} 
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                Nenhum documento encontrado
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Retention Form Modal */}
      {editingDocument && editMode === 'retention' && (
        <DocumentRetentionForm
          document={editingDocument}
          shipmentId={shipment.id}
          onClose={closeEditMode}
          onUpdate={onDocumentUpdate}
        />
      )}
      
      {/* Delivery Form Modal */}
      {editingDocument && editMode === 'delivery' && (
        <DocumentDeliveryForm
          document={editingDocument}
          shipmentId={shipment.id}
          onClose={closeEditMode}
          onUpdate={onDocumentUpdate}
        />
      )}
    </div>
  );
}
