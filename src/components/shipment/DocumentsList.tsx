
import React, { useState } from 'react';
import { Document } from "@/types/shipment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit } from "lucide-react";
import { DocumentForm } from './DocumentForm';
import { DocumentItem } from './document';
import { useShipments } from "@/contexts/shipments";
import { useDocumentForm } from './hooks/document-operations/useDocumentForm';
import { useDocumentSubmission } from './hooks/document-operations/useDocumentSubmission';
import { useDocumentDeletion } from './hooks/document-operations/useDocumentDeletion';

interface DocumentsListProps {
  shipmentId: string;
  documents: Document[];
  onStatusChange?: () => void;
}

export function DocumentsList({ shipmentId, documents, onStatusChange }: DocumentsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  
  const {
    minuteNumber,
    setMinuteNumber,
    invoiceNumbers,
    setInvoiceNumbers,
    packages,
    setPackages,
    weight,
    setWeight,
    notes,
    setNotes,
    resetForm,
    populateForm
  } = useDocumentForm();

  const { handleCreateDocument, handleUpdateDocument } = useDocumentSubmission({
    shipmentId,
    setIsDialogOpen
  });

  const { handleDelete } = useDocumentDeletion({
    shipmentId
  });

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    populateForm(document);
    setIsDialogOpen(true);
  };

  const handleDelete = async (documentId: string) => {
    await handleDelete(documentId);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsDialogOpen(false);
      setEditingDocument(null);
      resetForm();
    }
  };

  const handleSubmit = async () => {
    if (editingDocument) {
      await handleUpdateDocument(
        editingDocument,
        minuteNumber,
        invoiceNumbers,
        packages,
        weight,
        notes
      );
    } else {
      await handleCreateDocument(
        minuteNumber,
        invoiceNumbers,
        packages,
        weight,
        notes
      );
    }
    
    // Reset form after successful submission
    resetForm();
    setEditingDocument(null);
    
    // Call status change callback if provided
    if (onStatusChange) {
      onStatusChange();
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingDocument(null);
    setIsDialogOpen(false);
  };

  const handleAddDocument = () => {
    resetForm();
    setEditingDocument(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Documentos</h3>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={handleAddDocument} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {documents.length > 0 ? (
          documents.map((document) => (
            <DocumentItem
              key={document.id}
              document={document}
              shipmentId={shipmentId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            Nenhum documento cadastrado
          </Card>
        )}
      </div>
    </div>
  );
}
