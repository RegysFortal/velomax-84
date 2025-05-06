
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { PayableAccount } from "@/types/financial";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PayableAccountsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (account: Omit<PayableAccount, "id" | "createdAt" | "updatedAt">) => void;
  account?: PayableAccount | null;
}

export function PayableAccountsForm({ open, onOpenChange, onSubmit, account }: PayableAccountsFormProps) {
  const [formData, setFormData] = useState({
    supplierName: "",
    description: "",
    amount: "",
    dueDate: "",
    paymentDate: "",
    paymentMethod: "transfer",
    status: "pending",
    categoryId: "cat-1",
    categoryName: "Combustível",
    recurring: false,
    recurrenceFrequency: "monthly",
    installments: "",
    currentInstallment: "",
    isFixedExpense: false,
    notes: "",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        supplierName: account.supplierName || "",
        description: account.description || "",
        amount: account.amount?.toString() || "",
        dueDate: account.dueDate || "",
        paymentDate: account.paymentDate || "",
        paymentMethod: account.paymentMethod || "transfer",
        status: account.status || "pending",
        categoryId: account.categoryId || "cat-1",
        categoryName: account.categoryName || "Combustível",
        recurring: account.recurring || false,
        recurrenceFrequency: account.recurrenceFrequency || "monthly",
        installments: account.installments?.toString() || "",
        currentInstallment: account.currentInstallment?.toString() || "",
        isFixedExpense: account.isFixedExpense || false,
        notes: account.notes || "",
      });
    } else {
      // Reset form for new account
      setFormData({
        supplierName: "",
        description: "",
        amount: "",
        dueDate: "",
        paymentDate: "",
        paymentMethod: "transfer",
        status: "pending",
        categoryId: "cat-1",
        categoryName: "Combustível",
        recurring: false,
        recurrenceFrequency: "monthly",
        installments: "",
        currentInstallment: "",
        isFixedExpense: false,
        notes: "",
      });
    }
  }, [account, open]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map category ID to category name
    let categoryName = "Combustível";
    switch (formData.categoryId) {
      case "cat-1":
        categoryName = "Combustível";
        break;
      case "cat-2":
        categoryName = "Aluguel";
        break;
      case "cat-3":
        categoryName = "Seguros";
        break;
      case "cat-4":
        categoryName = "Manutenção";
        break;
      case "cat-5":
        categoryName = "Serviços";
        break;
      default:
        categoryName = "Outros";
    }
    
    // Calculate status based on dates
    let status = formData.status;
    if (formData.paymentDate) {
      status = "paid";
    } else if (new Date(formData.dueDate) < new Date()) {
      status = "overdue";
    } else {
      status = "pending";
    }
    
    onSubmit({
      supplierName: formData.supplierName,
      description: formData.description,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      paymentMethod: formData.paymentMethod as any,
      status: status as any,
      categoryId: formData.categoryId,
      categoryName,
      recurring: formData.recurring,
      recurrenceFrequency: formData.recurring ? formData.recurrenceFrequency as any : undefined,
      installments: formData.installments ? parseInt(formData.installments) : undefined,
      currentInstallment: formData.currentInstallment ? parseInt(formData.currentInstallment) : undefined,
      isFixedExpense: formData.isFixedExpense,
      notes: formData.notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{account ? "Editar Conta a Pagar" : "Nova Conta a Pagar"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-name">Fornecedor</Label>
                <Input
                  id="supplier-name"
                  value={formData.supplierName}
                  onChange={(e) => handleChange("supplierName", e.target.value)}
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
                    <SelectItem value="cat-1">Combustível</SelectItem>
                    <SelectItem value="cat-2">Aluguel</SelectItem>
                    <SelectItem value="cat-3">Seguros</SelectItem>
                    <SelectItem value="cat-4">Manutenção</SelectItem>
                    <SelectItem value="cat-5">Serviços</SelectItem>
                    <SelectItem value="cat-6">Outros</SelectItem>
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
                <Label htmlFor="payment-method">Forma de Pagamento</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleChange("paymentMethod", value)}
                >
                  <SelectTrigger id="payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="card">Cartão</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="bank_slip">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-date">Data de Pagamento</Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleChange("paymentDate", e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="fixed-expense"
                  checked={formData.isFixedExpense}
                  onCheckedChange={(checked) => handleChange("isFixedExpense", checked as boolean)}
                />
                <Label htmlFor="fixed-expense">Despesa Fixa</Label>
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="recurring"
                  checked={formData.recurring}
                  onCheckedChange={(checked) => handleChange("recurring", checked as boolean)}
                />
                <Label htmlFor="recurring">Recorrente</Label>
              </div>
            </div>
            
            {formData.recurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recurrence-frequency">Frequência</Label>
                  <Select
                    value={formData.recurrenceFrequency}
                    onValueChange={(value) => handleChange("recurrenceFrequency", value)}
                  >
                    <SelectTrigger id="recurrence-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="installments">Número de Parcelas</Label>
                  <Input
                    id="installments"
                    type="number"
                    value={formData.installments}
                    onChange={(e) => handleChange("installments", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="current-installment">Parcela Atual</Label>
                  <Input
                    id="current-installment"
                    type="number"
                    value={formData.currentInstallment}
                    onChange={(e) => handleChange("currentInstallment", e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit}>{account ? "Salvar Alterações" : "Cadastrar Conta"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
