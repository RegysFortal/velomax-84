
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Budget } from '@/types/budget';
import { BudgetActions } from './BudgetActions';
import { formatToReadableDate } from '@/utils/dateUtils';

interface BudgetTableRowProps {
  budget: Budget;
  getClientName: (clientId: string) => string;
  calculateTotalWeight: (budget: Budget) => number;
  formatCurrency: (value: number) => string;
  onPrint: (budget: Budget) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetTableRow({
  budget,
  getClientName,
  calculateTotalWeight,
  formatCurrency,
  onPrint,
  onEdit,
  onDelete
}: BudgetTableRowProps) {
  const totalWeight = calculateTotalWeight(budget);
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return formatToReadableDate(new Date(dateString));
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {getClientName(budget.clientId)}
      </TableCell>
      <TableCell>{formatDate(budget.createdAt)}</TableCell>
      <TableCell>
        <Badge variant="outline">{budget.totalVolumes}</Badge>
      </TableCell>
      <TableCell>
        {totalWeight.toFixed(2)} kg
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(budget.totalValue)}
      </TableCell>
      <TableCell className="text-right">
        <BudgetActions 
          budget={budget}
          onPrint={onPrint}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
