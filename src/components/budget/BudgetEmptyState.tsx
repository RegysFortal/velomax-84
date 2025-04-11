
import React from 'react';
import { Button } from '@/components/ui/button';
import { PackageOpen } from 'lucide-react';

interface BudgetEmptyStateProps {
  searchTerm: string;
  dateFilter: Date | undefined;
  onClearFilters?: () => void;
}

export function BudgetEmptyState({ 
  searchTerm, 
  dateFilter, 
  onClearFilters 
}: BudgetEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Nenhum orçamento encontrado</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {searchTerm || dateFilter 
          ? "Tente ajustar os filtros de busca" 
          : "Crie seu primeiro orçamento clicando no botão \"Novo Orçamento\" acima."}
      </p>
      {(searchTerm || dateFilter) && onClearFilters && (
        <Button 
          variant="outline" 
          onClick={onClearFilters}
        >
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
