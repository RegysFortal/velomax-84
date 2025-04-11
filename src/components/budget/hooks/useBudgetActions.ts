
import { Budget } from '@/types/budget';
import { printBudget } from '@/utils/printUtils';
import { useNavigate } from 'react-router-dom';

interface UseBudgetActionsProps {
  getClientName: (clientId: string) => string;
}

export function useBudgetActions({ getClientName }: UseBudgetActionsProps) {
  const navigate = useNavigate();

  // Handle print
  const handlePrint = (budget: Budget) => {
    const clientName = getClientName(budget.clientId);
    printBudget(budget, clientName);
  };

  // Handle edit - Corrigido para utilizar navegação
  const handleEdit = (budget: Budget) => {
    console.log("Edit budget:", budget);
    // Implementação correta para edição - redirecionar para formulário com o ID
    navigate(`/budget/edit/${budget.id}`);
  };

  return {
    handlePrint,
    handleEdit
  };
}
