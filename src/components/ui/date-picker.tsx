
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
import { parseDateString, formatPartialDateString } from "@/utils/dateUtils"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  allowTyping?: boolean
  disabled?: boolean
}

export function DatePicker({ 
  date, 
  onSelect, 
  placeholder = "Selecionar data", 
  allowTyping = true,
  disabled = false 
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState<string>("")
  
  // Update input value when date changes externally
  React.useEffect(() => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy", { locale: ptBR });
      setInputValue(formattedDate)
    } else {
      setInputValue("")
    }
  }, [date])
  
  // Handle manual input when allowTyping is true
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowTyping || disabled) return
    
    const value = e.target.value
    const formatted = formatPartialDateString(value)
    setInputValue(formatted)
    
    // Only attempt to parse if we have a complete date format
    if (formatted.length === 10) {
      const parsedDate = parseDateString(formatted)
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        onSelect?.(parsedDate)
      }
    }
  }
  
  const handleSelect = (newDate: Date | undefined) => {
    setOpen(false)
    
    if (newDate) {
      // Create a new date object to avoid timezone issues
      const year = newDate.getFullYear();
      const month = newDate.getMonth();
      const day = newDate.getDate();
      
      // Create date with noon time in local timezone to avoid date shifting
      const localDate = new Date(year, month, day, 12, 0, 0);
      
      onSelect?.(localDate)
      setInputValue(format(localDate, "dd/MM/yyyy", { locale: ptBR }))
    } else {
      onSelect?.(undefined)
      setInputValue("")
    }
  }
  
  // Handler for input click to open calendar
  const handleInputClick = () => {
    if (disabled) return;
    
    if (allowTyping) {
      // Only open calendar on icon click if typing is allowed
      return
    }
    setOpen(true)
  }

  return (
    <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            placeholder={placeholder}
            className={cn("pr-10", disabled && "opacity-50 cursor-not-allowed")}
            readOnly={!allowTyping || disabled}
            disabled={disabled}
          />
          {!disabled && (
            <CalendarIcon 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70 cursor-pointer"
              onClick={() => !disabled && setOpen(true)}
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={ptBR}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  )
}
