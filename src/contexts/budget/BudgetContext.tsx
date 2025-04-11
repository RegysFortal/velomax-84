
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Budget } from '@/types/budget';
import { useBudgetStorage } from './useBudgetStorage';
import { useBudgetCRUD } from './useBudgetCRUD';

type BudgetContextType = {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudget: (id: string) => Budget | undefined;
  loading: boolean;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  
  // Use custom hooks for storage and CRUD operations
  const { budgets, setBudgets } = useBudgetStorage();
  const { 
    addBudget, 
    updateBudget, 
    deleteBudget, 
    getBudget 
  } = useBudgetCRUD({ budgets, setBudgets, setLoading });

  return (
    <BudgetContext.Provider value={{
      budgets,
      addBudget,
      updateBudget,
      deleteBudget,
      getBudget,
      loading,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};
