
import { useState } from 'react';
import { useShipments } from '@/contexts/shipments';
import { Document } from '@/types/shipment';
import { toast } from 'sonner';

interface UseDocumentOperationsProps {
  shipmentId: string;
}

export function useDocumentOperations({ shipmentId }: UseDocumentOperationsProps) {
  const { addDocument, updateDocument, deleteDocument, shipments } = useShipments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  
  // Form state
  const [minuteNumber, setMinuteNumber] = useState('');
  const [invoiceNumbers, setInvoiceNumbers] = useState<string[]>([]);
  const [packages, setPackages] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [isDelivered, setIsDelivered] = useState(false);
  
  /**
   * Opens the dialog for adding or editing a document
   */
  const handleOpenDialog = (document?: Document) => {
    if (document) {
      // Editing existing document
      setEditingDocument(document);
      setMinuteNumber(document.minuteNumber || '');
      setInvoiceNumbers(document.invoiceNumbers || []);
      setPackages(document.packages !== undefined ? String(document.packages) : '');
      setWeight(document.weight !== undefined ? String(document.weight) : '');
      setNotes(document.notes || '');
      setIsDelivered(document.isDelivered || false);
    } else {
      // Adding new document
      setEditingDocument(null);
      setMinuteNumber('');
      setInvoiceNumbers([]);
      setPackages('');
      setWeight('');
      setNotes('');
      setIsDelivered(false);
    }
    
    setIsDialogOpen(true);
  };
  
  /**
   * Submits the document form for adding or editing
   */
  const handleSubmit = async () => {
    try {
      const packageCount = packages ? parseInt(packages) : undefined;
      const weightValue = weight ? parseFloat(weight) : undefined;
      
      // Validate
      if (packageCount !== undefined && isNaN(packageCount)) {
        toast.error("Número de volumes deve ser um valor numérico válido");
        return;
      }
      
      if (weightValue !== undefined && isNaN(weightValue)) {
        toast.error("Peso deve ser um valor numérico válido");
        return;
      }
      
      console.log("Submitting document with invoice numbers:", invoiceNumbers);
      
      if (editingDocument) {
        // Update existing document
        const updatedDocument = {
          ...editingDocument,
          minuteNumber: minuteNumber.trim() || undefined,
          invoiceNumbers: invoiceNumbers,
          packages: packageCount,
          weight: weightValue,
          notes: notes.trim() || undefined,
          isDelivered
        };
        
        // Get the current shipment
        const shipment = shipments.find(s => s.id === shipmentId);
        
        if (!shipment) {
          toast.error("Embarque não encontrado");
          return;
        }
        
        // Update the document in the array
        const updatedDocuments = shipment.documents.map(doc => 
          doc.id === editingDocument.id ? updatedDocument : doc
        );
        
        console.log("Updating document:", updatedDocument);
        console.log("Updated documents array:", updatedDocuments);
        
        await updateDocument(shipmentId, editingDocument.id, updatedDocuments);
        toast.success("Documento atualizado com sucesso");
      } else {
        // Add new document
        // Generate a document name if none provided
        const docName = `Documento ${Date.now()}`;
        
        await addDocument(shipmentId, {
          name: docName,
          type: "invoice", // Default type
          minuteNumber: minuteNumber.trim() || undefined,
          invoiceNumbers: invoiceNumbers,
          packages: packageCount,
          weight: weightValue,
          notes: notes.trim() || undefined,
          isDelivered
        });
        
        toast.success("Documento adicionado com sucesso");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting document:", error);
      toast.error("Erro ao salvar documento");
    }
  };
  
  /**
   * Deletes a document
   */
  const handleDelete = async (documentId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este documento?")) {
      try {
        await deleteDocument(shipmentId, documentId);
        toast.success("Documento excluído com sucesso");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Erro ao excluir documento");
      }
    }
  };
  
  return {
    isDialogOpen,
    setIsDialogOpen,
    editingDocument,
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
    isDelivered,
    setIsDelivered,
    handleOpenDialog,
    handleSubmit,
    handleDelete
  };
}
