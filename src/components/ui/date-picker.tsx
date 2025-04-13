
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

export function DatePicker({ date, onSelect, placeholder = "Selecionar data", allowTyping = true }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  
  // Update input value when date changes externally
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Ensure we're working with a clean date object (without time)
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      const cleanDate = new Date(year, month, day);
      
      setInputValue(format(cleanDate, "dd/MM/yyyy"));
      
      // Ensure we're passing a valid date to the parent component
      if (onSelect) {
        console.log('DatePicker - Selecting date:', format(cleanDate, 'yyyy-MM-dd'));
        onSelect(cleanDate);
      }
    } else {
      setInputValue("");
      if (onSelect) {
        onSelect(undefined);
      }
    }
    
    setIsPopoverOpen(false);
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
      // Try to parse the input as a date
      const dateParts = inputValue.split('/');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts.map(Number);
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const parsedDate = new Date(year, month - 1, day);
          if (parsedDate.getDate() === day) {
            handleDateSelect(parsedDate);
            return;
          }
        }
      }
      
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
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="px-2"
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background z-[1000]" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={ptBR}
            className="pointer-events-auto z-[1000]"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
