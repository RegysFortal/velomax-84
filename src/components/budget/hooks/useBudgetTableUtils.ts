
import { useState, useMemo } from 'react';
import { Budget } from '@/types/budget';
import { Client } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { printBudget } from '@/utils/printUtils';

interface UseBudgetTableUtilsProps {
  budgets: Budget[];
  clients: Client[];
  searchTerm: string;
  dateFilter: Date | undefined;
  sortConfig: { key: string; direction: 'ascending' | 'descending' } | null;
}

export function useBudgetTableUtils({
  budgets,
  clients,
  searchTerm,
  dateFilter,
  sortConfig
}: UseBudgetTableUtilsProps) {
  
  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? (client.tradingName || client.name) : 'Cliente não encontrado';
  };

  // Calculate total weight from package measurements
  const calculateTotalWeight = (budget: Budget) => {
    return budget.packages.reduce((total, pkg) => {
      const weight = pkg.weight * (pkg.quantity || 1);
      return total + weight;
    }, 0);
  };

  // Handle print
  const handlePrint = (budget: Budget) => {
    const clientName = getClientName(budget.clientId);
    printBudget(budget, clientName);
  };

  // Handle edit
  const handleEdit = (budget: Budget) => {
    console.log("Edit budget:", budget);
    // You can implement the edit functionality here
  };

  // Filter and sort budgets
  const filteredBudgets = useMemo(() => {
    return [...budgets]
      .filter(budget => {
        const clientName = getClientName(budget.clientId).toLowerCase();
        const searchMatch = !searchTerm || 
          clientName.includes(searchTerm.toLowerCase());

        // Date filter
        const dateMatch = !dateFilter || 
          (budget.createdAt && new Date(budget.createdAt).toDateString() === dateFilter.toDateString());

        return searchMatch && dateMatch;
      })
      .sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'client':
            aValue = getClientName(a.clientId).toLowerCase();
            bValue = getClientName(b.clientId).toLowerCase();
            break;
          case 'date':
            aValue = new Date(a.createdAt || '').getTime();
            bValue = new Date(b.createdAt || '').getTime();
            break;
          case 'volumes':
            aValue = a.totalVolumes;
            bValue = b.totalVolumes;
            break;
          case 'weight':
            aValue = calculateTotalWeight(a);
            bValue = calculateTotalWeight(b);
            break;
          case 'value':
            aValue = a.totalValue;
            bValue = b.totalValue;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
  }, [budgets, clients, searchTerm, dateFilter, sortConfig]);

  return {
    getClientName,
    formatCurrency,
    calculateTotalWeight,
    handlePrint,
    handleEdit,
    filteredBudgets
  };
}
