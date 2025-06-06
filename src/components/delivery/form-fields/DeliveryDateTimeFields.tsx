
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';
import { toISODateString, fromISODateString } from '@/utils/dateUtils';

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
                date={field.value ? fromISODateString(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    // Create safe date at noon to avoid timezone issues
                    const year = date.getFullYear();
                    const month = date.getMonth();
                    const day = date.getDate();
                    const safeDate = new Date(year, month, day, 12, 0, 0);
                    
                    const isoDate = toISODateString(safeDate);
                    console.log('DeliveryDateTimeFields - Data selecionada:', safeDate, 'Convertida para ISO:', isoDate);
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
                onChange={(e) => {
                  field.onChange(e.target.value || '');
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
