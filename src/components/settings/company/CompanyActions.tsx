
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface CompanyActionsProps {
  onSave: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function CompanyActions({ onSave, disabled = false, loading = false }: CompanyActionsProps) {
  return (
    <CardFooter className="flex justify-between">
      <Button 
        onClick={onSave} 
        disabled={disabled || loading}
      >
        {loading && (
          <span className="mr-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        {disabled ? "Sem permissão para salvar" : loading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </CardFooter>
  );
}
