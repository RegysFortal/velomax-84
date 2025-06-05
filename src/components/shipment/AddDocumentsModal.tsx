
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { InvoiceNumberInput } from "./InvoiceNumberInput";

interface DocumentData {
  id: string;
  minuteNumber: string;
  invoiceNumbers: string[];
  packages: string;
  weight: string;
  internalNotes: string;
  notificationNotes: string;
}

interface AddDocumentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (documents: DocumentData[]) => void;
}

export function AddDocumentsModal({ open, onOpenChange, onSave }: AddDocumentsModalProps) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  const addDocument = () => {
    const newDocument: DocumentData = {
      id: Date.now().toString(),
      minuteNumber: '',
      invoiceNumbers: [],
      packages: '',
      weight: '',
      internalNotes: '',
      notificationNotes: ''
    };
    setDocuments([...documents, newDocument]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const updateDocument = (id: string, field: keyof DocumentData, value: any) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const handleSave = () => {
    // Validar se pelo menos um documento foi adicionado
    if (documents.length === 0) {
      return;
    }
    
    // Validar campos obrigatórios
    const isValid = documents.every(doc => 
      doc.minuteNumber.trim() && 
      doc.invoiceNumbers.length > 0 && 
      doc.packages.trim() && 
      doc.weight.trim()
    );
    
    if (!isValid) {
      return;
    }
    
    onSave(documents);
    setDocuments([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDocuments([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Documentos</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {documents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhum documento adicionado ainda</p>
              <Button onClick={addDocument}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Documento
              </Button>
            </div>
          )}
          
          {documents.map((document, index) => (
            <div key={document.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Documento {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDocument(document.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`minute-${document.id}`}>Número da Minuta *</Label>
                  <Input
                    id={`minute-${document.id}`}
                    value={document.minuteNumber}
                    onChange={(e) => updateDocument(document.id, 'minuteNumber', e.target.value)}
                    placeholder="Digite o número da minuta"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Número(s) de Nota(s) Fiscal(is) *</Label>
                  <InvoiceNumberInput
                    value={document.invoiceNumbers}
                    onChange={(invoices) => updateDocument(document.id, 'invoiceNumbers', invoices)}
                    placeholder="Digite os números das notas fiscais"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`packages-${document.id}`}>Quantidade de Volumes *</Label>
                  <Input
                    id={`packages-${document.id}`}
                    type="number"
                    min="0"
                    value={document.packages}
                    onChange={(e) => updateDocument(document.id, 'packages', e.target.value)}
                    placeholder="Digite a quantidade de volumes"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`weight-${document.id}`}>Peso (kg) *</Label>
                  <Input
                    id={`weight-${document.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={document.weight}
                    onChange={(e) => updateDocument(document.id, 'weight', e.target.value)}
                    placeholder="Digite o peso em kg"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`internal-notes-${document.id}`}>Observações (uso interno)</Label>
                  <Textarea
                    id={`internal-notes-${document.id}`}
                    value={document.internalNotes}
                    onChange={(e) => updateDocument(document.id, 'internalNotes', e.target.value)}
                    placeholder="Digite observações para uso interno"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`notification-notes-${document.id}`}>Observações para Notificação</Label>
                  <Textarea
                    id={`notification-notes-${document.id}`}
                    value={document.notificationNotes}
                    onChange={(e) => updateDocument(document.id, 'notificationNotes', e.target.value)}
                    placeholder="Digite observações que aparecerão nas notificações"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {documents.length > 0 && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={addDocument}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Outro Documento
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} disabled={documents.length === 0}>
            Salvar Documentos
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
