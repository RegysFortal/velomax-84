
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShipments } from "@/contexts/ShipmentsContext";
import { Document } from "@/types/shipment";
import { FileText, Trash2, PlusCircle, ExternalLink, FileEdit } from "lucide-react";
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
  const [type, setType] = useState<"cte" | "invoice" | "delivery_location" | "other">("cte");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  
  const resetForm = () => {
    setName("");
    setType("cte");
    setUrl("");
    setNotes("");
    setEditingDocument(null);
  };
  
  const handleOpenDialog = (document?: Document) => {
    resetForm();
    if (document) {
      setName(document.name);
      setType(document.type);
      setUrl(document.url || "");
      setNotes(document.notes || "");
      setEditingDocument(document);
    }
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDocument) {
        // Ensure all required fields are present
        const updatedDoc = {
          name,
          type,
          url: url || undefined,
          notes: notes || undefined,
        };
        await updateDocument(shipmentId, editingDocument.id, updatedDoc);
        toast.success("Documento atualizado com sucesso");
      } else {
        // Ensure all required fields are present
        const newDoc = {
          name,  // This is required
          type,  // This is required
          url: url || undefined,
          notes: notes || undefined,
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
  
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "cte": return "CT-e";
      case "invoice": return "Nota Fiscal";
      case "delivery_location": return "Local de Entrega";
      case "other": return "Outro";
      default: return type;
    }
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "cte": return <FileText className="h-4 w-4 text-blue-500" />;
      case "invoice": return <FileText className="h-4 w-4 text-green-500" />;
      case "delivery_location": return <FileText className="h-4 w-4 text-yellow-500" />;
      case "other": return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4" />;
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
                {getDocumentIcon(doc.type)}
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {getDocumentTypeLabel(doc.type)}
                    {doc.notes && ` • ${doc.notes}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {doc.url && (
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
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
                  placeholder="Ex: CT-e 12345"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Tipo de Documento</label>
                <Select value={type} onValueChange={(value: any) => setType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cte">CT-e</SelectItem>
                    <SelectItem value="invoice">Nota Fiscal</SelectItem>
                    <SelectItem value="delivery_location">Local de Entrega</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">URL do Documento (opcional)</label>
                <Input 
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://"
                  type="url"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Observações (opcional)</label>
                <Textarea 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre o documento"
                  rows={3}
                />
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
