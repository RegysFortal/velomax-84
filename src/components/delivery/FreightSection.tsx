
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDeliveryFormContext } from './context/DeliveryFormContext';

interface FreightSectionProps {
  isEditMode: boolean;
}

export const FreightSection: React.FC<FreightSectionProps> = ({ isEditMode }) => {
  const { form, freight, setFreight } = useDeliveryFormContext();
  
  const watchIsCourtesy = form.watch('isCourtesy');
  const watchHasCustomPrice = form.watch('hasCustomPrice');
  
  const handleFreightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFreight(value);
    form.setValue('totalFreight', value);
  };

  // Show freight input if it's custom pricing or if it's edit mode
  const showFreightInput = watchHasCustomPrice || isEditMode;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Valor do Frete</h3>
      
      {watchIsCourtesy && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">
            Entrega cortesia - Frete: R$ 0,00
          </p>
        </div>
      )}
      
      {!watchIsCourtesy && !showFreightInput && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800">
            Frete calculado automaticamente: <span className="font-medium">R$ {freight.toFixed(2)}</span>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            O valor será calculado com base na tabela de preços do cliente
          </p>
        </div>
      )}
      
      {!watchIsCourtesy && showFreightInput && (
        <FormField
          control={form.control}
          name="totalFreight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do Frete (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={field.value || freight}
                  onChange={handleFreightChange}
                  className="text-lg font-medium"
                />
              </FormControl>
              <FormMessage />
              {watchHasCustomPrice && (
                <p className="text-sm text-orange-600">
                  Valor personalizado - será usado independente da tabela de preços
                </p>
              )}
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
