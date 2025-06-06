
import React, { useState } from 'react';
import { Document, Shipment } from "@/types/shipment";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentRetentionForm } from "./DocumentRetentionForm";
import { DocumentDeliveryForm } from "./DocumentDeliveryForm";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { DocumentStatusControl } from "../DocumentStatusControl";

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

                  {/* Retention Information */}
                  {document.isRetained && document.retentionInfo && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <h4 className="font-medium text-red-800 mb-2">Informações de Retenção</h4>
                      <div className="text-sm text-red-700 space-y-1">
                        {document.retentionInfo.reason && (
                          <div><strong>Motivo:</strong> {document.retentionInfo.reason}</div>
                        )}
                        {document.retentionInfo.amount && (
                          <div><strong>Valor:</strong> R$ {document.retentionInfo.amount}</div>
                        )}
                        {document.retentionInfo.actionNumber && (
                          <div><strong>Número da Ação:</strong> {document.retentionInfo.actionNumber}</div>
                        )}
                        {document.retentionInfo.paymentDate && (
                          <div><strong>Data de Pagamento:</strong> {document.retentionInfo.paymentDate}</div>
                        )}
                        {document.retentionInfo.releaseDate && (
                          <div><strong>Data de Liberação:</strong> {document.retentionInfo.releaseDate}</div>
                        )}
                        {document.retentionInfo.notes && (
                          <div><strong>Observações:</strong> {document.retentionInfo.notes}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delivery Information */}
                  {document.isDelivered && document.deliveryInfo && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                      <h4 className="font-medium text-green-800 mb-2">Informações de Entrega</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        {document.deliveryInfo.receiverName && (
                          <div><strong>Recebedor:</strong> {document.deliveryInfo.receiverName}</div>
                        )}
                        {document.deliveryInfo.receiverId && (
                          <div><strong>ID do Recebedor:</strong> {document.deliveryInfo.receiverId}</div>
                        )}
                        {document.deliveryInfo.deliveryDate && (
                          <div><strong>Data de Entrega:</strong> {document.deliveryInfo.deliveryDate}</div>
                        )}
                        {document.deliveryInfo.deliveryTime && (
                          <div><strong>Hora de Entrega:</strong> {document.deliveryInfo.deliveryTime}</div>
                        )}
                        {document.deliveryInfo.arrivalKnowledgeNumber && (
                          <div><strong>Número do Conhecimento:</strong> {document.deliveryInfo.arrivalKnowledgeNumber}</div>
                        )}
                        {document.deliveryInfo.notes && (
                          <div><strong>Observações:</strong> {document.deliveryInfo.notes}</div>
                        )}
                      </div>
                    </div>
                  )}
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
