
import React from 'react';
import { Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/shipment";
import { usePriorityToggle } from '../hooks/usePriorityToggle';

interface PriorityButtonProps {
  document: Document;
  shipmentId: string;
  onStatusChange?: () => void;
}

export function PriorityButton({ document, shipmentId, onStatusChange }: PriorityButtonProps) {
  const { handleTogglePriority } = usePriorityToggle(shipmentId, document, onStatusChange);
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`ml-1 h-6 w-6 p-0 ${document.isPriority ? 'text-red-500' : 'text-muted-foreground'}`}
      onClick={handleTogglePriority}
      title={document.isPriority ? "Remover prioridade" : "Marcar como prioritário"}
    >
      <Siren className="h-4 w-4" />
    </Button>
  );
}
