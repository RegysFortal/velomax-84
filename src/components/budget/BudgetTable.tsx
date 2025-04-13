
import React, { useState } from 'react';
import { useBudgets } from '@/contexts';
import { useClients } from '@/contexts';
import {
  Table,
  TableBody,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { BudgetEmptyState } from './BudgetEmptyState';
import { BudgetTableRow } from './BudgetTableRow';
import { BudgetTableHeader } from './BudgetTableHeader';
import { useBudgetTableUtils } from './hooks/useBudgetTableUtils';
import { Budget } from '@/types/budget';
import { BudgetEditDialog } from './BudgetEditDialog';

interface BudgetTableProps {
  searchTerm: string;
  dateFilter: Date | undefined;
  onClearFilters?: () => void;
}

export function BudgetTable({ 
  searchTerm, 
  dateFilter, 
  onClearFilters 
}: BudgetTableProps) {
  const { budgets, deleteBudget } = useBudgets();
  const { clients } = useClients();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { 
    getClientName, 
    formatCurrency,
    calculateTotalWeight,
    handlePrint,
    filteredBudgets
  } = useBudgetTableUtils({
    budgets,
    clients,
    searchTerm,
    dateFilter,
    sortConfig
  });

  // Sorting function
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle edit
  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <div className="p-4">
        {filteredBudgets.length === 0 ? (
          <BudgetEmptyState 
            searchTerm={searchTerm}
            dateFilter={dateFilter}
            onClearFilters={onClearFilters}
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <BudgetTableHeader 
                requestSort={requestSort} 
                sortConfig={sortConfig}
                searchTerm=""
                setSearchTerm={() => {}}
                dateFilter={undefined}
                setDateFilter={() => {}}
              />
              <TableBody>
                {filteredBudgets.map((budget) => (
                  <BudgetTableRow
                    key={budget.id}
                    budget={budget}
                    getClientName={getClientName}
                    calculateTotalWeight={calculateTotalWeight}
                    formatCurrency={formatCurrency}
                    onPrint={handlePrint}
                    onEdit={handleEdit}
                    onDelete={deleteBudget}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {editingBudget && (
        <BudgetEditDialog
          budget={editingBudget}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </Card>
  );
}
