
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';

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
  timeLabel = "Hora (Opcional)",
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
              <DatePicker
                date={field.value ? new Date(`${field.value}T12:00:00`) : undefined}
                onSelect={(date) => {
                  if (date) {
                    // Create ISO date string using local date components
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const isoDate = `${year}-${month}-${day}`;
                    console.log('Data selecionada:', date, 'ISO formatada:', isoDate);
                    field.onChange(isoDate);
                  } else {
                    field.onChange('');
                  }
                }}
                allowTyping={true}
              />
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
              <Input 
                type="time" 
                {...field} 
                value={field.value || ''}
                className="bg-background" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
