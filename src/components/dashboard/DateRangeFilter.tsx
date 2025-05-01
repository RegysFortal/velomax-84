
import React from 'react';
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
import { parseDateString } from "@/utils/dateUtils";

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

  React.useEffect(() => {
    if (dateRange?.from) {
      setInputFrom(format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }));
    }
    if (dateRange?.to) {
      setInputTo(format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }));
    }
  }, [dateRange]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputFrom(e.target.value);
    const date = parseDateString(e.target.value);
    if (date) {
      onDateRangeChange({
        from: date,
        to: dateRange?.to
      });
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTo(e.target.value);
    const date = parseDateString(e.target.value);
    if (date) {
      onDateRangeChange({
        from: dateRange?.from,
        to: date
      });
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
            />
            <span>até</span>
            <Input
              value={inputTo}
              onChange={handleToChange}
              placeholder="DD/MM/AAAA"
              className="w-[120px]"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="ml-2"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendário
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
};
