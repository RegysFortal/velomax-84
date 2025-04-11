
import { useState, useEffect } from 'react';
import { Budget } from '@/types/budget';

export function useBudgetStorage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Load budgets from localStorage on mount
  useEffect(() => {
    const storedBudgets = localStorage.getItem('velomax_budgets');
    if (storedBudgets) {
      try {
        setBudgets(JSON.parse(storedBudgets));
      } catch (error) {
        console.error("Failed to parse stored budgets", error);
      }
    }
  }, []);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    if (budgets.length > 0) {
      localStorage.setItem('velomax_budgets', JSON.stringify(budgets));
    }
  }, [budgets]);

  return { budgets, setBudgets };
}
