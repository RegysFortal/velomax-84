
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReceivableAccount } from "@/types/financial";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { useReceivableAccountsTable } from "../hooks/useReceivableAccountsTable";

interface ReceivableAccountsTableProps {
  accounts: ReceivableAccount[];
  onEdit: (account: ReceivableAccount) => void;
  onDelete: (id: string) => void;
  onMarkAsReceived: (id: string, fullAmount: boolean, partialAmount?: number) => void;
  isLoading?: boolean;
}

export const ReceivableAccountsTable = ({
  accounts,
  onEdit,
  onDelete,
  onMarkAsReceived,
  isLoading = false
}: ReceivableAccountsTableProps) => {
  const {
    accountToDelete,
    setAccountToDelete,
    receiveDialogOpen,
    setReceiveDialogOpen,
    partialAmount,
    setPartialAmount,
    selectedAccount,
    setSelectedAccount,
    receiveMethod,
    setReceiveMethod,
    formatCurrency,
    handleDelete,
    handleOpenReceiveDialog,
    handleReceive,
    getStatusLabel,
    getPaymentMethodLabel
  } = useReceivableAccountsTable(onDelete, onMarkAsReceived);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Carregando contas a receber...
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma conta a receber encontrada.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    {account.clientName}
                  </TableCell>
                  <TableCell>{account.description}</TableCell>
                  <TableCell>{account.categoryName}</TableCell>
                  <TableCell>
                    {format(new Date(account.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {account.status === "partially_received" ? (
                      <>
                        <div>{formatCurrency(account.amount)}</div>
                        <div className="text-xs text-muted-foreground">
                          Recebido: {formatCurrency(account.receivedAmount || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Restante: {formatCurrency(account.remainingAmount || 0)}
                        </div>
                      </>
                    ) : (
                      formatCurrency(account.amount)
                    )}
                  </TableCell>
                  <TableCell>{getStatusLabel(account.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {account.status !== "received" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReceiveDialog(account)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Receber
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAccountToDelete(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conta a receber? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Recebimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="receive-method">Forma de Recebimento</Label>
              <Select value={receiveMethod} onValueChange={setReceiveMethod}>
                <SelectTrigger id="receive-method">
                  <SelectValue placeholder="Selecione um método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank_slip">Boleto</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partial-amount">Valor Recebido (R$)</Label>
              <Input
                id="partial-amount"
                type="number"
                step="0.01"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
              />
              {selectedAccount && (
                <p className="text-xs text-muted-foreground">
                  Valor total: {formatCurrency(selectedAccount.amount)}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleReceive(
                parseFloat(partialAmount) >= (selectedAccount?.amount || 0)
              )}
            >
              Confirmar Recebimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
