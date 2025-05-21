
import React from 'react';
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/shipment";

interface DocumentActionsProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
}

export function DocumentActions({ document, onEdit, onDelete }: DocumentActionsProps) {
  return (
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
  );
}
