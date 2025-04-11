
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';
import { formatToReadableDate } from '@/utils/dateUtils';

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
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    // Convert to ISO string format (YYYY-MM-DD)
                    const formattedDate = date.toISOString().split('T')[0];
                    console.log("Selected date:", formattedDate);
                    field.onChange(formattedDate);
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
              <Input type="time" {...field} className="bg-background" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
