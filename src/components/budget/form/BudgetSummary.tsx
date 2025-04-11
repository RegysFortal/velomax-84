
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { BudgetFormValues } from './BudgetFormSchema';
import { PriceTable } from '@/types/priceTable';

interface BudgetSummaryProps {
  form: UseFormReturn<BudgetFormValues>;
  priceTable?: PriceTable;
}

export function BudgetSummary({ form, priceTable }: BudgetSummaryProps) {
  const watchHasCollection = form.watch("hasCollection");
  const watchHasDelivery = form.watch("hasDelivery");
  
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Resumo</h3>
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between">
            <span>Total de volumes:</span>
            <span>{form.getValues("totalVolumes")}</span>
          </div>
          {priceTable && (
            <div className="flex justify-between">
              <span>Tabela de preços:</span>
              <span>{priceTable.name} ({priceTable.multiplier}x)</span>
            </div>
          )}
          {watchHasCollection && watchHasDelivery && (
            <div className="flex justify-between text-amber-600">
              <span>Coleta + Entrega:</span>
              <span>Valor x2</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Valor total:</span>
            <span>{formatCurrency(form.getValues("totalValue"))}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
