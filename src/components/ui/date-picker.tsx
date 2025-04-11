
import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  allowTyping?: boolean
}

export function DatePicker({ date, onSelect, placeholder = "Selecionar data", allowTyping = false }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState<string>("");
  
  // Update input value when date changes externally
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    console.log('DatePicker - Date selected:', selectedDate);
    if (onSelect) {
      onSelect(selectedDate);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Only attempt to parse input as date if allowTyping is true
    if (allowTyping && value.length === 10) { // Complete date format: DD/MM/YYYY
      const [day, month, year] = value.split('/').map(Number);
      
      // Validate date components
      if (
        !isNaN(day) && !isNaN(month) && !isNaN(year) &&
        day >= 1 && day <= 31 &&
        month >= 1 && month <= 12 &&
        year >= 1900 && year <= 2100
      ) {
        const newDate = new Date(year, month - 1, day);
        // Check if it's a valid date (e.g., not Feb 31)
        if (newDate.getDate() === day) {
          handleDateSelect(newDate);
          return;
        }
      }
    }
  };

  const handleInputBlur = () => {
    // Reset the input to the current date format if typing produced an invalid date
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
    } else if (inputValue && inputValue.length > 0) {
      // Clear invalid input
      setInputValue("");
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="DD/MM/YYYY"
        className="flex-1"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="px-2"
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={ptBR}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
