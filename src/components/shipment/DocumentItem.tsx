
import React from 'react';
import { Document } from "@/types/shipment";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentItemProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (documentId: string) => void;
}

export function DocumentItem({ document, onEdit, onDelete }: DocumentItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {document.minuteNumber && (
                <div>
                  <span className="text-sm font-medium">Minuta:</span>{" "}
                  <span className="text-sm">{document.minuteNumber}</span>
                </div>
              )}
            </div>
            
            {document.invoiceNumbers && document.invoiceNumbers.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Notas Fiscais:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {document.invoiceNumbers.map((invoiceNumber, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {invoiceNumber}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {document.packages && (
                <div>
                  <span className="font-medium">Volumes:</span> {document.packages}
                </div>
              )}
              
              {document.weight && (
                <div>
                  <span className="font-medium">Peso:</span> {document.weight} kg
                </div>
              )}
            </div>
            
            {document.notes && (
              <div className="text-sm mt-2">
                <span className="font-medium">Observações:</span> {document.notes}
              </div>
            )}
            
            {document.isDelivered && (
              <Badge variant="default" className="mt-2">Entregue</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(document)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(document.id)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

