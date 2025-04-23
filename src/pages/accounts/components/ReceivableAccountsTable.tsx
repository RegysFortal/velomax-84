
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ReceivableAccount } from '@/types';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Check, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface ReceivableAccountsTableProps {
  accounts: ReceivableAccount[];
  onEditAccount: (account: ReceivableAccount) => void;
  onDeleteAccount: (id: string) => void;
  onMarkAsReceived: (id: string, fullAmount: boolean, partialAmount?: number) => void;
}

export function ReceivableAccountsTable({
  accounts,
  onEditAccount,
  onDeleteAccount,
  onMarkAsReceived
}: ReceivableAccountsTableProps) {
  const [partialDialog, setPartialDialog] = useState({ open: false, accountId: '', amount: 0 });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'received':
        return <Badge className="bg-green-600 hover:bg-green-700">Recebido</Badge>;
      case 'partially_received':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Parcial</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600 hover:bg-red-700">Atrasado</Badge>;
      default:
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Pendente</Badge>;
    }
  };
  
  const handlePartialReceive = () => {
    if (partialDialog.accountId && partialDialog.amount > 0) {
      onMarkAsReceived(partialDialog.accountId, false, partialDialog.amount);
      setPartialDialog({ open: false, accountId: '', amount: 0 });
    }
  };
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Cliente</TableHead>
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
                  Nenhuma conta a receber encontrada
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.clientName}</TableCell>
                  <TableCell>{account.description}</TableCell>
                  <TableCell>{account.categoryName || 'Sem categoria'}</TableCell>
                  <TableCell>{format(new Date(account.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(account.amount)}
                    {account.status === 'partially_received' && account.receivedAmount && (
                      <div className="text-xs text-muted-foreground">
                        Recebido: {formatCurrency(account.receivedAmount)}
                      </div>
                    )}
                  </TableCell>
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
                        {(account.status === 'pending' || account.status === 'overdue' || account.status === 'partially_received') && (
                          <>
                            <DropdownMenuItem onClick={() => onMarkAsReceived(account.id, true)}>
                              <Check className="mr-2 h-4 w-4" />
                              <span>Marcar como recebido (total)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setPartialDialog({
                                open: true,
                                accountId: account.id,
                                amount: account.remainingAmount || account.amount
                              })}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              <span>Recebimento parcial</span>
                            </DropdownMenuItem>
                          </>
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
      
      {/* Partial Payment Dialog */}
      <Dialog open={partialDialog.open} onOpenChange={(open) => setPartialDialog({ ...partialDialog, open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Recebimento Parcial</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="partialAmount">Valor Recebido</Label>
              <Input
                id="partialAmount"
                type="number"
                value={partialDialog.amount}
                onChange={(e) => setPartialDialog({ ...partialDialog, amount: parseFloat(e.target.value) })}
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPartialDialog({ open: false, accountId: '', amount: 0 })}
            >
              Cancelar
            </Button>
            <Button onClick={handlePartialReceive}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
