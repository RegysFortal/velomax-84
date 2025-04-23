
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PayableAccount } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Check, Edit, MoreHorizontal, Trash } from 'lucide-react';

interface PayableAccountsTableProps {
  accounts: PayableAccount[];
  onEditAccount: (account: PayableAccount) => void;
  onDeleteAccount: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
}

export function PayableAccountsTable({
  accounts,
  onEditAccount,
  onDeleteAccount,
  onMarkAsPaid
}: PayableAccountsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <Badge className="bg-green-600 hover:bg-green-700">Pago</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600 hover:bg-red-700">Atrasado</Badge>;
      default:
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Pendente</Badge>;
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Fornecedor</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Nenhuma conta a pagar encontrada
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.supplierName}</TableCell>
                <TableCell>
                  {account.description}
                  {account.isFixedExpense && (
                    <Badge variant="outline" className="ml-2">Fixa</Badge>
                  )}
                  {account.recurring && (
                    <Badge variant="outline" className="ml-2">Recorrente</Badge>
                  )}
                </TableCell>
                <TableCell>{account.categoryName || 'Sem categoria'}</TableCell>
                <TableCell>{format(new Date(account.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(account.amount)}</TableCell>
                <TableCell>{getStatusBadge(account.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {account.status !== 'paid' && (
                        <DropdownMenuItem onClick={() => onMarkAsPaid(account.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          <span>Marcar como pago</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEditAccount(account)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteAccount(account.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
