
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Document } from "@/types/shipment";
import { useShipments } from "@/contexts/ShipmentsContext";
import { toast } from "sonner";
import { FileText, Pencil, Plus, Trash2, Link2 } from "lucide-react";

const documentSchema = z.object({
  name: z.string().min(2, "Nome do documento é obrigatório"),
  type: z.enum(["cte", "invoice", "delivery_location", "other"]),
  url: z.string().optional(),
  notes: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentsListProps {
  shipmentId: string;
  documents: Document[];
}

export function DocumentsList({ shipmentId, documents }: DocumentsListProps) {
  const { addDocument, updateDocument, deleteDocument } = useShipments();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      type: "cte",
      url: "",
      notes: "",
    },
  });

  const openEditDialog = (document: Document) => {
    setEditingDocument(document);
    form.reset({
      name: document.name,
      type: document.type,
      url: document.url || "",
      notes: document.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingDocument(null);
    form.reset({
      name: "",
      type: "cte",
      url: "",
      notes: "",
    });
    setIsAddDialogOpen(true);
  };

  const onSubmit = async (data: DocumentFormValues) => {
    setIsLoading(true);

    try {
      if (editingDocument) {
        await updateDocument(shipmentId, editingDocument.id, data);
        toast.success("Documento atualizado com sucesso!");
      } else {
        await addDocument(shipmentId, data);
        toast.success("Documento adicionado com sucesso!");
      }
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Erro ao salvar o documento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm("Tem certeza que deseja excluir este documento?")) {
      try {
        await deleteDocument(shipmentId, documentId);
        toast.success("Documento excluído com sucesso");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Erro ao excluir o documento");
      }
    }
  };

  const documentTypeLabel = {
    cte: "Conhecimento de Transporte (CT-e)",
    invoice: "Nota Fiscal",
    delivery_location: "Local de Entrega",
    other: "Outro",
  };

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Documentos do Embarque</h3>
        <Button size="sm" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>Nenhum documento cadastrado para este embarque</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">{document.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {documentTypeLabel[document.type]}
                  </p>
                  {document.notes && (
                    <p className="text-xs mt-1">{document.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {document.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={document.url} target="_blank" rel="noopener noreferrer">
                      <Link2 className="h-4 w-4" />
                      <span className="sr-only">Abrir link</span>
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(document)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDocument(document.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Document Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => !open && setIsAddDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDocument ? "Editar Documento" : "Adicionar Documento"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Documento</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do documento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cte">Conhecimento de Transporte (CT-e)</SelectItem>
                        <SelectItem value="invoice">Nota Fiscal</SelectItem>
                        <SelectItem value="delivery_location">Local de Entrega</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/documento"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informações adicionais sobre o documento"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
