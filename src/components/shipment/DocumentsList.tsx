
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShipments } from "@/contexts/ShipmentsContext";
import { Document } from "@/types/shipment";
import { FileText, Trash2, PlusCircle, FileEdit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DocumentsListProps {
  shipmentId: string;
  documents: Document[];
}

export function DocumentsList({ shipmentId, documents }: DocumentsListProps) {
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
          type: "invoice" // Default type since we're not asking for it anymore
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
            <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {doc.minuteNumber && `Minuta: ${doc.minuteNumber}`}
                    {doc.minuteNumber && doc.packages && " • "}
                    {doc.packages && `Volumes: ${doc.packages}`}
                    {doc.packages && doc.weight && " • "}
                    {doc.weight && `Peso: ${doc.weight} kg`}
                    {(doc.minuteNumber || doc.packages || doc.weight) && doc.notes && " • "}
                    {doc.notes && doc.notes}
                    {doc.isDelivered && " • Entregue"}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(doc)}>
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDocument ? "Editar Documento" : "Adicionar Documento"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome do Documento</label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Nota Fiscal 12345"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="minuteNumber" className="text-sm font-medium">Número da Minuta</label>
                <Input 
                  id="minuteNumber"
                  value={minuteNumber}
                  onChange={(e) => setMinuteNumber(e.target.value)}
                  placeholder="Ex: MIN12345"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="packages" className="text-sm font-medium">Volumes</label>
                  <Input 
                    id="packages"
                    type="number"
                    value={packages}
                    onChange={(e) => setPackages(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="weight" className="text-sm font-medium">Peso (kg)</label>
                  <Input 
                    id="weight"
                    type="number"
                    step="0.01"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.00"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Observações</label>
                <Textarea 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre o documento"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isDelivered" 
                  checked={isDelivered}
                  onChange={(e) => setIsDelivered(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="isDelivered" className="text-sm font-medium">
                  Marcar como entregue
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingDocument ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
