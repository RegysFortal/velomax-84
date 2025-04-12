
import React from 'react';
import { Document } from "@/types/shipment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FileText, Package, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DocumentItemProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
}

export function DocumentItem({ document, onEdit, onDelete }: DocumentItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-500" />
            <h4 className="font-medium">{document.name}</h4>
            {document.isDelivered ? (
              <Badge className="ml-2 bg-green-500">Entregue</Badge>
            ) : (
              <Badge className="ml-2 bg-yellow-500">Pendente</Badge>
            )}
          </div>
          
          {document.minuteNumber && (
            <div className="text-sm text-muted-foreground mt-1">
              Minuta: {document.minuteNumber}
            </div>
          )}
          
          <div className="mt-2 space-y-1">
            {document.invoiceNumbers && document.invoiceNumbers.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Notas Fiscais:</span>{' '}
                {document.invoiceNumbers.join(', ')}
              </div>
            )}
            
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
