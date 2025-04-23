
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, CheckCircle, DollarSign } from 'lucide-react';
import { ReceivableAccount } from '@/types/financial';

export interface ReceivableAccountsTableProps {
  accounts: ReceivableAccount[];
  onEdit: (account: ReceivableAccount) => void;
  onDelete: (id: string) => void;
  onMarkAsReceived: (id: string, fullAmount?: boolean, partialAmount?: number) => void;
}

export function ReceivableAccountsTable({ 
  accounts,
  onEdit,
  onDelete,
  onMarkAsReceived 
}: ReceivableAccountsTableProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: ReceivableAccount['status']) => {
    switch (status) {
      case 'received':
        return <Badge className="bg-green-500">Recebido</Badge>;
      case 'partially_received':
        return <Badge className="bg-blue-500">Recebido Parcialmente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Atrasado</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Nenhuma conta a receber registrada
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.clientName}</TableCell>
                <TableCell>{account.description}</TableCell>
                <TableCell>{formatCurrency(account.amount)}</TableCell>
                <TableCell>{formatDate(account.dueDate)}</TableCell>
                <TableCell>{getStatusBadge(account.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(account)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    {(account.status === 'pending' || account.status === 'overdue') && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-green-600"
                        onClick={() => onMarkAsReceived(account.id, true)}
                        title="Marcar como recebido"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {(account.status === 'pending' || account.status === 'overdue') && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-blue-600"
                        onClick={() => {
                          const partialAmount = parseFloat(prompt('Valor recebido (R$):', '') || '0');
                          if (partialAmount > 0 && partialAmount < account.amount) {
                            onMarkAsReceived(account.id, false, partialAmount);
                          }
                        }}
                        title="Recebimento parcial"
                      >
                        <DollarSign className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-600"
                      onClick={() => onDelete(account.id)}
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
  );
}
