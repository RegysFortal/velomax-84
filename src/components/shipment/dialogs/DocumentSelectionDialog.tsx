
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Document } from "@/types/shipment";
import { FileText, Package } from "lucide-react";

interface DocumentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: Document[];
  onContinue: (selectedDocumentIds: string[]) => void;
  onCancel: () => void;
}

export function DocumentSelectionDialog({
  open,
  onOpenChange,
  documents,
  onContinue,
  onCancel
}: DocumentSelectionDialogProps) {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  // Filter to only show undelivered documents
  const undeliveredDocuments = documents.filter(doc => !doc.isDelivered);
  
  const handleSelectionChange = (documentId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedDocumentIds(prev => [...prev, documentId]);
    } else {
      setSelectedDocumentIds(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleContinue = () => {
    if (selectedDocumentIds.length === 0) {
      return; // Don't continue if no documents are selected
    }
    onContinue(selectedDocumentIds);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Reset selection when dialog is closed
      setSelectedDocumentIds([]);
      onCancel();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione os documentos a serem entregues</DialogTitle>
        </DialogHeader>
        
        {undeliveredDocuments.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Todos os documentos já foram entregues.
          </div>
        ) : (
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {undeliveredDocuments.map((document) => (
              <div 
                key={document.id} 
                className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50"
              >
                <Checkbox 
                  id={`doc-${document.id}`} 
                  checked={selectedDocumentIds.includes(document.id)}
                  onCheckedChange={(checked) => 
                    handleSelectionChange(document.id, checked === true)
                  }
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={`doc-${document.id}`}
                    className="font-medium cursor-pointer"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      {document.name}
                    </div>
                  </Label>
                  
                  <div className="mt-1 text-sm text-muted-foreground">
                    {document.minuteNumber && (
                      <div>Minuta: {document.minuteNumber}</div>
                    )}
                    
                    {document.invoiceNumbers && document.invoiceNumbers.length > 0 && (
                      <div>NFs: {document.invoiceNumbers.join(', ')}</div>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-1">
                      {document.packages !== undefined && (
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {document.packages} volumes
                        </div>
                      )}
                      
                      {document.weight !== undefined && (
                        <div>{document.weight} kg</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button 
            onClick={handleContinue}
            disabled={selectedDocumentIds.length === 0}
          >
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
