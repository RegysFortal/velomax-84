
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface DeliveryDateTimeFieldsProps {
  control: Control<any>;
  dateLabel?: string;
  timeLabel?: string;
  dateName?: string;
  timeName?: string;
}

export function DeliveryDateTimeFields({ 
  control,
  dateLabel = "Data de Entrega",
  timeLabel = "Hora",
  dateName = "deliveryDate",
  timeName = "deliveryTime"
}: DeliveryDateTimeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name={dateName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dateLabel}</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name={timeName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{timeLabel}</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
