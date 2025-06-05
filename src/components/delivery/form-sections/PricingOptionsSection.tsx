
import React from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface PricingOptionsSectionProps {
  control: Control<any>;
  setValue?: UseFormSetValue<any>;
}

export function PricingOptionsSection({ control, setValue }: PricingOptionsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="isCourtesy"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked && setValue) {
                    setValue('totalFreight', 0);
                    setValue('hasCustomPrice', false);
                  }
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Entrega Cortesia
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Marque se esta entrega é cortesia (frete zerado)
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="hasCustomPrice"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked && setValue) {
                    setValue('isCourtesy', false);
                  }
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Entrega com valor personalizado
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Marque para inserir manualmente o valor do frete
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
