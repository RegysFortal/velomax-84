
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { toISODateString, fromISODateString } from '@/utils/dateUtils';

interface DatePickerFieldProps {
  id?: string;
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  date?: Date;
  onDateChange?: (date: Date) => void;
  placeholder?: string;
  allowTyping?: boolean;
  disabled?: boolean;
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  date,
  onDateChange,
  placeholder = "Selecione uma data",
  allowTyping = true,
  disabled = false
}: DatePickerFieldProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value || date);

  useEffect(() => {
    setSelectedDate(value || date);
  }, [value, date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Create safe date at noon to avoid timezone issues
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      const safeDate = new Date(year, month, day, 12, 0, 0);
      
      console.log('DatePickerField - Date selected:', safeDate);
      setSelectedDate(safeDate);
      
      if (onChange) {
        onChange(safeDate);
      }
      
      if (onDateChange) {
        onDateChange(safeDate);
      }
    } else {
      setSelectedDate(undefined);
      if (onChange) {
        onChange(undefined);
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <DatePicker 
        date={selectedDate} 
        onSelect={handleDateSelect} 
        placeholder={placeholder}
        allowTyping={allowTyping}
        disabled={disabled}
      />
    </div>
  );
}
