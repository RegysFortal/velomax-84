
import { Budget } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useClientPriceTable } from './useClientPriceTable';
import { useBudgetCalculations } from '@/components/budget/hooks/useBudgetCalculations';

interface UseBudgetCRUDProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useBudgetCRUD({ budgets, setBudgets, setLoading }: UseBudgetCRUDProps) {
  const { toast } = useToast();
  const { getClientPriceTable } = useClientPriceTable();
  const { calculateBudgetValue } = useBudgetCalculations();

  const addBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);
      const timestamp = new Date().toISOString();
      
      // Get the client's price table
      const priceTable = getClientPriceTable(budgetData.clientId);
      
      // Calculate the total value based on the client's price table
      const totalValue = calculateBudgetValue({
        ...budgetData,
        id: '',
        createdAt: timestamp,
        updatedAt: timestamp
      }, priceTable);
      
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
      
      // Check if we need to recalculate the total value
      const needsRecalculation = 
        'clientId' in budgetUpdate || 
        'packages' in budgetUpdate || 
        'deliveryType' in budgetUpdate || 
        'merchandiseValue' in budgetUpdate ||
        'additionalServices' in budgetUpdate ||
        'hasCollection' in budgetUpdate ||
        'hasDelivery' in budgetUpdate;
      
      let updatedTotalValue = currentBudget.totalValue;
      
      if (needsRecalculation) {
        const updatedBudget: Budget = {
          ...currentBudget,
          ...budgetUpdate
        };
        
        const clientId = updatedBudget.clientId;
        const priceTable = getClientPriceTable(clientId);
        
        updatedTotalValue = calculateBudgetValue(updatedBudget, priceTable);
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

  return {
    addBudget,
    updateBudget,
    deleteBudget,
    getBudget
  };
}
