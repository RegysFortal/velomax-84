
import { useState } from 'react';
import { Document } from '@/types/shipment';

/**
 * Hook for managing the document dialog state
 */
export function useDocumentDialogState() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  
  /**
   * Opens the dialog for adding or editing a document
   */
  const handleOpenDialog = (document?: Document) => {
    if (document) {
      // Editing existing document
      setEditingDocument(document);
    } else {
      // Adding new document
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
