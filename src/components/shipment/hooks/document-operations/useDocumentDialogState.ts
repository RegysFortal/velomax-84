
import { useState } from 'react';
import { Document } from '@/types/shipment';

/**
 * Hook for managing document dialog state
 */
export function useDocumentDialogState() {
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  /**
   * Opens the document dialog in add or edit mode
   */
  const handleOpenDialog = (document?: Document) => {
    console.log("Opening document dialog", document ? "for editing" : "for creation");
    if (document) {
      console.log("Document to edit:", document);
      setEditingDocument(document);
    } else {
      setEditingDocument(null);
    }
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingDocument,
    setEditingDocument,
    handleOpenDialog
  };
}
