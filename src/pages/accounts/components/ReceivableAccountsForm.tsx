
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ReceivableAccount } from "@/types/financial";

interface ReceivableAccountsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (account: Omit<ReceivableAccount, "id" | "createdAt" | "updatedAt">) => void;
  account?: ReceivableAccount | null;
}

export function ReceivableAccountsForm({ open, onOpenChange, onSubmit, account }: ReceivableAccountsFormProps) {
  const [formData, setFormData] = useState({
    clientId: "client-1",
    clientName: "",
    description: "",
    amount: "",
    dueDate: "",
    receivedDate: "",
    receivedAmount: "",
    receivedMethod: "pix",
    notes: "",
    categoryId: "cat-1",
    categoryName: "Fretes",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        clientId: account.clientId || "client-1",
        clientName: account.clientName || "",
        description: account.description || "",
        amount: account.amount?.toString() || "",
        dueDate: account.dueDate || "",
        receivedDate: account.receivedDate || "",
        receivedAmount: account.receivedAmount?.toString() || "",
        receivedMethod: account.receivedMethod || "pix",
        notes: account.notes || "",
        categoryId: account.categoryId || "cat-1",
        categoryName: account.categoryName || "Fretes",
      });
    } else {
      // Reset form for new account
      setFormData({
        clientId: "client-1",
        clientName: "",
        description: "",
        amount: "",
        dueDate: "",
        receivedDate: "",
        receivedAmount: "",
        receivedMethod: "pix",
        notes: "",
        categoryId: "cat-1",
        categoryName: "Fretes",
      });
    }
  }, [account, open]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine status based on dates and amounts
    let status = "pending";
    let remainingAmount: number | undefined = undefined;
    
    if (formData.receivedDate) {
      const totalAmount = parseFloat(formData.amount);
      const receivedAmount = formData.receivedAmount ? parseFloat(formData.receivedAmount) : totalAmount;
      
      if (receivedAmount >= totalAmount) {
        status = "received";
        remainingAmount = 0;
      } else {
        status = "partially_received";
        remainingAmount = totalAmount - receivedAmount;
      }
    } else if (new Date(formData.dueDate) < new Date()) {
      status = "overdue";
    }
    
    onSubmit({
      clientId: formData.clientId,
      clientName: formData.clientName,
      description: formData.description,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      receivedDate: formData.receivedDate || undefined,
      receivedAmount: formData.receivedAmount ? parseFloat(formData.receivedAmount) : undefined,
      remainingAmount,
      receivedMethod: formData.receivedMethod as any,
      status: status as any,
      categoryId: formData.categoryId,
      categoryName: formData.categoryName,
      notes: formData.notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{account ? "Editar Conta a Receber" : "Nova Conta a Receber"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Cliente</Label>
              <Input
                id="client-name"
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleChange("categoryId", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat-1">Fretes</SelectItem>
                  <SelectItem value="cat-2">Serviços</SelectItem>
                  <SelectItem value="cat-3">Produtos</SelectItem>
                  <SelectItem value="cat-4">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due-date">Data de Vencimento</Label>
              <Input
                id="due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="received-date">Data de Recebimento</Label>
              <Input
                id="received-date"
                type="date"
                value={formData.receivedDate}
                onChange={(e) => handleChange("receivedDate", e.target.value)}
              />
            </div>
            
            {formData.receivedDate && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="received-amount">Valor Recebido (R$)</Label>
                  <Input
                    id="received-amount"
                    type="number"
                    step="0.01"
                    value={formData.receivedAmount || formData.amount}
                    onChange={(e) => handleChange("receivedAmount", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="received-method">Forma de Recebimento</Label>
                  <Select
                    value={formData.receivedMethod}
                    onValueChange={(value) => handleChange("receivedMethod", value)}
                  >
                    <SelectTrigger id="received-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="bank_slip">Boleto</SelectItem>
                      <SelectItem value="transfer">Transferência</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{account ? "Salvar Alterações" : "Cadastrar Conta"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
