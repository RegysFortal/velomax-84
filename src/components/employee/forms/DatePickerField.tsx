
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

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
  // When value changes externally, ensure the component reflects it
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value || date);

  useEffect(() => {
    setSelectedDate(value || date);
  }, [value, date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setSelectedDate(selectedDate);
    
    // Call the appropriate callback
    if (onChange) {
      onChange(selectedDate);
    }
    
    if (onDateChange && selectedDate) {
      onDateChange(selectedDate);
    }
    
    console.log('Date selected:', selectedDate);
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
