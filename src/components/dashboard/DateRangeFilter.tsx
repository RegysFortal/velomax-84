
import React, { useEffect } from 'react';
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { parseDateString, formatPartialDateString } from "@/utils/dateUtils";

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DateRangeFilter = ({
  dateRange,
  onDateRangeChange
}: DateRangeFilterProps) => {
  const [inputFrom, setInputFrom] = React.useState(() => {
    if (dateRange?.from) {
      return format(dateRange.from, "dd/MM/yyyy", { locale: ptBR });
    }
    return "";
  });

  const [inputTo, setInputTo] = React.useState(() => {
    if (dateRange?.to) {
      return format(dateRange.to, "dd/MM/yyyy", { locale: ptBR });
    }
    return "";
  });

  // Update inputs when external dates change
  useEffect(() => {
    if (dateRange?.from) {
      setInputFrom(format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }));
    } else {
      setInputFrom("");
    }
    
    if (dateRange?.to) {
      setInputTo(format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }));
    } else {
      setInputTo("");
    }
  }, [dateRange]);

  // Handler for start date input
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPartialDateString(value);
    setInputFrom(formatted);
    
    // Only attempt to parse if we have enough characters for a complete date
    if (formatted.length === 10) {
      const date = parseDateString(formatted);
      if (date) {
        onDateRangeChange({
          from: date,
          to: dateRange?.to
        });
      }
    }
  };

  // Handler for end date input
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPartialDateString(value);
    setInputTo(formatted);
    
    // Only attempt to parse if we have enough characters for a complete date
    if (formatted.length === 10) {
      const date = parseDateString(formatted);
      if (date) {
        onDateRangeChange({
          from: dateRange?.from,
          to: date
        });
      }
    }
  };

  // Calendar popover state
  const [open, setOpen] = React.useState(false);
  
  // Calendar selection handler
  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (range) {
      // Fix timezone issues by setting time to noon
      const adjustedRange: DateRange = {
        from: range.from ? new Date(range.from.setHours(12, 0, 0, 0)) : undefined,
        to: range.to ? new Date(range.to.setHours(12, 0, 0, 0)) : undefined
      };
      
      onDateRangeChange(adjustedRange);
      
      // Only close the popover when a complete range is selected
      if (adjustedRange.from && adjustedRange.to) {
        setOpen(false);
      }
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-medium">Filtro de Período</h3>
          <p className="text-sm text-muted-foreground">Filtre os dados por período</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-2">
            <Input
              value={inputFrom}
              onChange={handleFromChange}
              placeholder="DD/MM/AAAA"
              className="w-[120px]"
              maxLength={10}
            />
            <span>até</span>
            <Input
              value={inputTo}
              onChange={handleToChange}
              placeholder="DD/MM/AAAA"
              className="w-[120px]"
              maxLength={10}
            />
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="ml-2"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendário
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleCalendarSelect}
                numberOfMonths={2}
                locale={ptBR}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
};
