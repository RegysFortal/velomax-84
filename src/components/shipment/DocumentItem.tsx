
import React from 'react';
import { Document } from "@/types/shipment";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, FileEdit } from "lucide-react";

interface DocumentItemProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (documentId: string) => void;
}

export function DocumentItem({ document, onEdit, onDelete }: DocumentItemProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-blue-500" />
        <div>
          <div className="font-medium">{document.name}</div>
          <div className="text-xs text-muted-foreground">
            {document.minuteNumber && `Minuta: ${document.minuteNumber}`}
            {document.minuteNumber && document.packages && " • "}
            {document.packages && `Volumes: ${document.packages}`}
            {document.packages && document.weight && " • "}
            {document.weight && `Peso: ${document.weight} kg`}
            {(document.minuteNumber || document.packages || document.weight) && document.notes && " • "}
            {document.notes && document.notes}
            {document.isDelivered && " • Entregue"}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(document)}>
          <FileEdit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(document.id)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
