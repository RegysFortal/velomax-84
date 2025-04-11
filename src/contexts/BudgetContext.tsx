
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Budget } from '@/types/budget';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useBudgetCalculation } from '@/hooks/useBudgetCalculation';

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
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { calculateBudgetValue } = useBudgetCalculation();

  // Retrieve budgets from localStorage on mount and save budgets to localStorage whenever they change
  useEffect(() => {
    // Load data from localStorage on mount
    const storedBudgets = localStorage.getItem('velomax_budgets');
    if (storedBudgets) {
      try {
        setBudgets(JSON.parse(storedBudgets));
      } catch (error) {
        console.error("Failed to parse stored budgets", error);
      }
    }
  }, []);

  // Save data to localStorage whenever budgets change
  useEffect(() => {
    if (budgets.length > 0) {
      localStorage.setItem('velomax_budgets', JSON.stringify(budgets));
    }
  }, [budgets]);

  const addBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);
      const timestamp = new Date().toISOString();
      
      // Calculate the total value based on the client's price table
      const totalValue = calculateBudgetValue({
        ...budgetData,
        id: '',
        createdAt: timestamp,
        updatedAt: timestamp
      });
      
      const newBudget: Budget = {
        ...budgetData,
        id: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
        totalValue: totalValue || budgetData.totalValue // Use calculated value or fallback to provided value
      };
      
      setBudgets(prev => [...prev, newBudget]);
      toast({
        title: "Orçamento criado",
        description: "O orçamento foi criado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Erro ao criar orçamento",
        description: "Ocorreu um erro ao criar o orçamento. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (id: string, budgetUpdate: Partial<Budget>): Promise<void> => {
    try {
      setLoading(true);
      
      // Get the current budget
      const currentBudget = budgets.find(budget => budget.id === id);
      if (!currentBudget) {
        throw new Error("Budget not found");
      }
      
      // If we're updating fields that affect the total value, recalculate it
      const needsRecalculation = 
        'clientId' in budgetUpdate || 
        'packages' in budgetUpdate || 
        'deliveryType' in budgetUpdate || 
        'merchandiseValue' in budgetUpdate ||
        'additionalServices' in budgetUpdate;
      
      let updatedTotalValue = currentBudget.totalValue;
      
      if (needsRecalculation) {
        const updatedBudget: Budget = {
          ...currentBudget,
          ...budgetUpdate
        };
        updatedTotalValue = calculateBudgetValue(updatedBudget);
      }
      
      setBudgets(prev => prev.map(budget => 
        budget.id === id 
          ? { 
              ...budget, 
              ...budgetUpdate, 
              totalValue: needsRecalculation ? updatedTotalValue : budget.totalValue,
              updatedAt: new Date().toISOString() 
            } 
          : budget
      ));
      
      toast({
        title: "Orçamento atualizado",
        description: "O orçamento foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Erro ao atualizar orçamento",
        description: "Ocorreu um erro ao atualizar o orçamento. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setBudgets(prev => prev.filter(budget => budget.id !== id));
      toast({
        title: "Orçamento removido",
        description: "O orçamento foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Erro ao remover orçamento",
        description: "Ocorreu um erro ao remover o orçamento. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBudget = (id: string): Budget | undefined => {
    return budgets.find(budget => budget.id === id);
  };

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
