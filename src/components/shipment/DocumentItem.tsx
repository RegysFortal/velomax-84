
import React from 'react';
import { Document, FiscalAction } from "@/types/shipment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FileText, Package, AlertTriangle, Siren } from "lucide-react";
import { DocumentStatusControl } from "./DocumentStatusControl";
import { useShipments } from "@/contexts/shipments";
import { toast } from "sonner";

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
  const { getShipmentById, updateDocument } = useShipments();
  
  // Format the document information for display
  const formatDocumentInfo = () => {
    const parts = [];
    
    // Always show minute number if it exists
    if (document.minuteNumber) {
      parts.push(`Minuta: ${document.minuteNumber}`);
    }
    
    return parts.join(' | ');
  };
  
  // Formatação do valor da retenção
  const formatCurrency = (value?: number) => {
    if (value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Toggle priority flag
  const handleTogglePriority = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shipment = getShipmentById(shipmentId);
      
      if (!shipment || !shipment.documents) {
        toast.error("Não foi possível encontrar os documentos do embarque");
        return;
      }
      
      // Update documents with priority flag toggled
      const updatedDocuments = shipment.documents.map(doc => {
        if (doc.id === document.id) {
          return {
            ...doc,
            isPriority: !doc.isPriority
          };
        }
        return doc;
      });
      
      // Update the document
      await updateDocument(shipmentId, document.id, updatedDocuments);
      
      // Show notification
      if (!document.isPriority) {
        toast.success("Documento marcado como prioritário");
      } else {
        toast.success("Prioridade removida do documento");
      }
      
      // Callback if provided
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error toggling priority:", error);
      toast.error("Erro ao alterar a prioridade do documento");
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-500" />
            <h4 className="font-medium">
              {document.minuteNumber ? `Minuta: ${document.minuteNumber}` : document.name}
            </h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`ml-1 h-6 w-6 p-0 ${document.isPriority ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleTogglePriority}
              title={document.isPriority ? "Remover prioridade" : "Marcar como prioritário"}
            >
              <Siren className="h-4 w-4" />
            </Button>
            <div className="ml-2">
              <DocumentStatusControl 
                shipmentId={shipmentId} 
                document={document} 
                onStatusChange={onStatusChange}
              />
            </div>
          </div>
          
          {/* Display invoice numbers if available, otherwise show document name */}
          {document.invoiceNumbers && document.invoiceNumbers.length > 0 ? (
            <div className="text-sm text-muted-foreground mt-1 font-medium">
              Nota(s) Fiscal(is): {document.invoiceNumbers.join(', ')}
            </div>
          ) : document.minuteNumber && document.name !== `Minuta: ${document.minuteNumber}` && (
            <div className="text-sm text-muted-foreground mt-1 font-medium">
              {document.name}
            </div>
          )}
          
          <div className="mt-2 space-y-1">
            {/* Remove the duplicate invoice numbers display from here since we now show it above */}
            
            <div className="flex items-center space-x-4 text-sm">
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
              <div className="text-sm text-muted-foreground">
                {document.notes}
              </div>
            )}
          </div>
          
          {/* Informações de Retenção (quando aplicável) */}
          {document.isRetained && (
            <div className="mt-3 border-t border-amber-200 pt-2">
              <div className="bg-amber-50 p-2 rounded text-sm">
                <div className="flex items-center text-amber-800 font-medium mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1 text-amber-600" />
                  Retenção Fiscal
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-amber-700">
                  {document.retentionInfo?.actionNumber && (
                    <div>Nº Ação: {document.retentionInfo.actionNumber}</div>
                  )}
                  {document.retentionInfo?.reason && (
                    <div>Motivo: {document.retentionInfo.reason}</div>
                  )}
                  {document.retentionInfo?.amount && (
                    <div>Valor: {formatCurrency(parseFloat(document.retentionInfo.amount))}</div>
                  )}
                  {document.retentionInfo?.paymentDate && (
                    <div>Pgto: {document.retentionInfo.paymentDate}</div>
                  )}
                  {document.retentionInfo?.releaseDate && (
                    <div>Liberação: {document.retentionInfo.releaseDate}</div>
                  )}
                  {document.retentionInfo?.notes && (
                    <div className="col-span-2">Obs: {document.retentionInfo.notes}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(document)}
            title="Editar documento"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(document.id)}
            title="Remover documento"
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
