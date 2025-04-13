
import { Budget } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useClientPriceTable } from './useClientPriceTable';
import { useBudgetCalculations } from '@/components/budget/hooks/useBudgetCalculations';
import { usePriceTables } from '@/contexts';
import { calculateBudgetValue } from '@/contexts/priceTables/priceTableUtils';

interface UseBudgetCRUDProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useBudgetCRUD({ budgets, setBudgets, setLoading }: UseBudgetCRUDProps) {
  const { toast } = useToast();
  const { getClientPriceTable } = useClientPriceTable();
  const { calculateTotalWeight } = useBudgetCalculations();
  const { priceTables } = usePriceTables();

  const addBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);
      const timestamp = new Date().toISOString();
      
      // Get the client's price table
      const priceTable = getClientPriceTable(budgetData.clientId);
      
      let totalValue = budgetData.totalValue;
      
      // Calculate the total value based on the client's price table
      if (priceTable) {
        const totalWeight = calculateTotalWeight(budgetData as Budget);
        
        totalValue = calculateBudgetValue(
          priceTable,
          budgetData.deliveryType,
          totalWeight,
          budgetData.merchandiseValue,
          budgetData.additionalServices,
          budgetData.hasCollection,
          budgetData.hasDelivery
        );
        
        console.log("Calculated budget value using price table:", totalValue);
      } else {
        console.warn("No price table found for client, using provided total value");
      }
      
      // Create new budget with calculated value
      const newBudget: Budget = {
        ...budgetData,
        id: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
        totalValue: totalValue
      };
      
      console.log("New budget being added:", newBudget);
      
      setBudgets(prev => [...prev, newBudget]);
      toast({
        title: "Orçamento criado",
        description: "O orçamento foi criado com sucesso.",
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Error creating budget",
        description: "An error occurred while creating the budget. Please try again.",
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
        
        if (priceTable) {
          const totalWeight = calculateTotalWeight(updatedBudget);
          
          updatedTotalValue = calculateBudgetValue(
            priceTable,
            updatedBudget.deliveryType,
            totalWeight,
            updatedBudget.merchandiseValue,
            updatedBudget.additionalServices,
            updatedBudget.hasCollection,
            updatedBudget.hasDelivery
          );
          
          console.log("Recalculating budget total value:", updatedTotalValue);
        }
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
      console.error("Erro ao remover orçamento:", error);
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
