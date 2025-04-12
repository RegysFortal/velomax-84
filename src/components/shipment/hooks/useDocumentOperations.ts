
import { useState, useEffect } from 'react';
import { useShipments } from "@/contexts/shipments";
import { Document } from "@/types/shipment";
import { toast } from "sonner";

interface UseDocumentOperationsProps {
  shipmentId: string;
}

export function useDocumentOperations({ shipmentId }: UseDocumentOperationsProps) {
  const { addDocument, updateDocument, deleteDocument, getShipmentById } = useShipments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  
  // Form state
  const [minuteNumber, setMinuteNumber] = useState("");
  const [invoiceNumbers, setInvoiceNumbers] = useState<string[]>([]);
  const [weight, setWeight] = useState("");
  const [packages, setPackages] = useState("");
  const [notes, setNotes] = useState("");
  const [isDelivered, setIsDelivered] = useState(false);
  
  useEffect(() => {
    // Depuração: verificar se o shipment existe e tem documentos
    const shipment = getShipmentById(shipmentId);
    console.log('useDocumentOperations - Shipment carregado:', shipment);
    console.log('useDocumentOperations - Documentos do shipment:', shipment?.documents);
  }, [shipmentId, getShipmentById]);
  
  const resetForm = () => {
    setMinuteNumber("");
    setInvoiceNumbers([]);
    setWeight("");
    setPackages("");
    setNotes("");
    setIsDelivered(false);
    setEditingDocument(null);
  };
  
  const handleOpenDialog = (document?: Document) => {
    resetForm();
    if (document) {
      setMinuteNumber(document.minuteNumber || "");
      setInvoiceNumbers(document.invoiceNumbers || []);
      setWeight(document.weight?.toString() || "");
      setPackages(document.packages?.toString() || "");
      setNotes(document.notes || "");
      setIsDelivered(!!document.isDelivered);
      setEditingDocument(document);
    }
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert weight and packages to numbers
      const weightValue = weight ? parseFloat(weight) : undefined;
      const packagesValue = packages ? parseInt(packages) : undefined;
      
      // Generate a document name from the waybill number or first invoice number
      const documentName = minuteNumber || (invoiceNumbers.length > 0 ? `Nota ${invoiceNumbers[0]}` : "Documento");
      
      if (editingDocument) {
        const updatedDoc = {
          name: documentName,
          minuteNumber: minuteNumber || undefined,
          invoiceNumbers: invoiceNumbers.length > 0 ? invoiceNumbers : undefined,
          weight: weightValue,
          packages: packagesValue,
          notes: notes || undefined,
          isDelivered
        };
        await updateDocument(shipmentId, editingDocument.id, updatedDoc);
        console.log('Documento atualizado:', updatedDoc);
        toast.success("Documento atualizado com sucesso");
      } else {
        const newDoc = {
          name: documentName,
          minuteNumber: minuteNumber || undefined,
          invoiceNumbers: invoiceNumbers.length > 0 ? invoiceNumbers : undefined,
          weight: weightValue,
          packages: packagesValue,
          notes: notes || undefined,
          isDelivered,
          type: "invoice" as const // Cast to literal type
        };
        await addDocument(shipmentId, newDoc);
        console.log('Novo documento adicionado:', newDoc);
        toast.success("Documento adicionado com sucesso");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Erro ao salvar documento");
    }
  };
  
  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(shipmentId, documentId);
      console.log('Documento removido:', documentId);
      toast.success("Documento removido com sucesso");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Erro ao remover documento");
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
  };
}
