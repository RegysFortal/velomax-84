
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
}

export function DatePicker({ date, onSelect, placeholder = "Selecionar data", allowTyping = true }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState<string>("")
  
  // Update input value when date changes externally
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy", { locale: ptBR }))
    } else {
      setInputValue("")
    }
  }, [date])
  
  // Handle manual input when allowTyping is true
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowTyping) return
    
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
  
  const handleSelect = (date: Date | undefined) => {
    setOpen(false)
    onSelect?.(date)
    
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy", { locale: ptBR }))
    }
  }
  
  // Handler for input click to open calendar
  const handleInputClick = () => {
    if (allowTyping) {
      // Only open calendar on icon click if typing is allowed
      return
    }
    setOpen(true)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            placeholder={placeholder}
            className="pr-10" // Make room for the calendar icon
            readOnly={!allowTyping}
          />
          <CalendarIcon 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70 cursor-pointer"
            onClick={() => setOpen(true)}
          />
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
