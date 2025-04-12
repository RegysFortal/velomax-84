
import React from 'react';
import { Button } from "@/components/ui/button";
import { Document } from "@/types/shipment";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { DocumentItem } from './DocumentItem';
import { DocumentForm } from './DocumentForm';
import { useDocumentOperations } from './hooks/useDocumentOperations';

interface DocumentsListProps {
  shipmentId: string;
  documents: Document[];
}

export function DocumentsList({ shipmentId, documents }: DocumentsListProps) {
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingDocument,
    minuteNumber,
    setMinuteNumber,
    invoiceNumbers,
    setInvoiceNumbers,
    weight,
    setWeight,
    packages,
    setPackages,
    notes,
    setNotes,
    isDelivered,
    setIsDelivered,
    handleOpenDialog,
    handleSubmit,
    handleDelete
  } = useDocumentOperations({ shipmentId });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Documentos</h3>
        <Button variant="outline" onClick={() => handleOpenDialog()} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground border border-dashed rounded-md">
          Nenhum documento encontrado
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <DocumentItem 
              key={doc.id}
              document={doc}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DocumentForm
            editingDocument={!!editingDocument}
            minuteNumber={minuteNumber}
            setMinuteNumber={setMinuteNumber}
            invoiceNumbers={invoiceNumbers}
            setInvoiceNumbers={setInvoiceNumbers}
            packages={packages}
            setPackages={setPackages}
            weight={weight}
            setWeight={setWeight}
            notes={notes}
            setNotes={setNotes}
            isDelivered={isDelivered}
            setIsDelivered={setIsDelivered}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
