
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface DatePickerFieldProps {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  placeholder = "Selecione uma data"
}: DatePickerFieldProps) {
  // When value changes externally, ensure the component reflects it
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onChange(date);
    console.log('Date selected:', date);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <DatePicker 
        date={selectedDate} 
        onSelect={handleDateSelect} 
        placeholder={placeholder}
      />
    </div>
  );
}
