
import { useState } from 'react';
import { useShipments } from "@/contexts/shipments";
import { Document } from "@/types/shipment";
import { toast } from "sonner";

interface UseDocumentOperationsProps {
  shipmentId: string;
}

export function useDocumentOperations({ shipmentId }: UseDocumentOperationsProps) {
  const { addDocument, updateDocument, deleteDocument } = useShipments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [minuteNumber, setMinuteNumber] = useState("");
  const [weight, setWeight] = useState("");
  const [packages, setPackages] = useState("");
  const [notes, setNotes] = useState("");
  const [isDelivered, setIsDelivered] = useState(false);
  
  const resetForm = () => {
    setName("");
    setMinuteNumber("");
    setWeight("");
    setPackages("");
    setNotes("");
    setIsDelivered(false);
    setEditingDocument(null);
  };
  
  const handleOpenDialog = (document?: Document) => {
    resetForm();
    if (document) {
      setName(document.name);
      setMinuteNumber(document.minuteNumber || "");
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
      
      if (editingDocument) {
        const updatedDoc = {
          name,
          minuteNumber: minuteNumber || undefined,
          weight: weightValue,
          packages: packagesValue,
          notes: notes || undefined,
          isDelivered
        };
        await updateDocument(shipmentId, editingDocument.id, updatedDoc);
        toast.success("Documento atualizado com sucesso");
      } else {
        const newDoc = {
          name,
          minuteNumber: minuteNumber || undefined,
          weight: weightValue,
          packages: packagesValue,
          notes: notes || undefined,
          isDelivered,
          type: "invoice" as const // Cast to literal type
        };
        await addDocument(shipmentId, newDoc);
        toast.success("Documento adicionado com sucesso");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Erro ao salvar documento");
      console.error(error);
    }
  };
  
  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(shipmentId, documentId);
      toast.success("Documento removido com sucesso");
    } catch (error) {
      toast.error("Erro ao remover documento");
      console.error(error);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingDocument,
    name,
    setName,
    minuteNumber,
    setMinuteNumber,
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
