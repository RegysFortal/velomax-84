
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
import { PayableAccount } from "@/types/financial";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

interface PayableAccountsTableProps {
  accounts: PayableAccount[];
  onEdit: (account: PayableAccount) => void;
  onDelete: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
  isLoading?: boolean;
}

export const PayableAccountsTable = ({
  accounts,
  onEdit,
  onDelete,
  onMarkAsPaid,
  isLoading = false
}: PayableAccountsTableProps) => {
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const handleDelete = () => {
    if (accountToDelete) {
      onDelete(accountToDelete);
      setAccountToDelete(null);
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-yellow-500 font-medium">Pendente</span>;
      case "paid":
        return <span className="text-green-500 font-medium">Pago</span>;
      case "overdue":
        return <span className="text-red-500 font-medium">Atrasado</span>;
      default:
        return <span className="text-gray-500 font-medium">Desconhecido</span>;
    }
  };
  
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX";
      case "boleto":
        return "Boleto";
      case "transferencia":
        return "Transferência";
      case "cartao":
        return "Cartão";
      case "especie":
        return "Dinheiro";
      default:
        return "Outro";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fornecedor</TableHead>
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
                  Carregando contas a pagar...
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma conta a pagar encontrada.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    {account.supplierName}
                  </TableCell>
                  <TableCell>{account.description}</TableCell>
                  <TableCell>{account.categoryName}</TableCell>
                  <TableCell>
                    {format(new Date(account.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{formatCurrency(account.amount)}</TableCell>
                  <TableCell>{getStatusLabel(account.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {account.status !== "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkAsPaid(account.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Pagar
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
              Tem certeza que deseja excluir esta conta a pagar? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
