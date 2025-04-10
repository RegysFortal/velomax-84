import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CalendarDays, 
  CalendarIcon, 
  Calendar
} from 'lucide-react';
import { format, startOfDay, startOfMonth, startOfYear } from 'date-fns';

interface DateFilterProps {
  dateFilter: 'day' | 'month' | 'year' | 'custom';
  setDateFilter: (filter: 'day' | 'month' | 'year' | 'custom') => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

export const DateFilter = ({
  dateFilter,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: DateFilterProps) => {
  
  useEffect(() => {
    const today = new Date();
    
    switch (dateFilter) {
      case 'day':
        setStartDate(format(startOfDay(today), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'month':
        setStartDate(format(startOfMonth(today), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'year':
        setStartDate(format(startOfYear(today), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      // For custom, we keep the existing dates
    }
  }, [dateFilter, setStartDate, setEndDate]);

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex gap-2">
        <Button 
          variant={dateFilter === 'day' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setDateFilter('day')}
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Dia
        </Button>
        <Button 
          variant={dateFilter === 'month' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setDateFilter('month')}
        >
          <CalendarDays className="h-4 w-4 mr-1" />
          Mês
        </Button>
        <Button 
          variant={dateFilter === 'year' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setDateFilter('year')}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Ano
        </Button>
        <Button 
          variant={dateFilter === 'custom' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setDateFilter('custom')}
        >
          Personalizado
        </Button>
      </div>
      
      {dateFilter === 'custom' && (
        <div className="flex gap-2 items-center">
          <div className="grid gap-1">
            <Label htmlFor="startDate" className="sr-only">Data inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 w-[130px]"
            />
          </div>
          <span className="text-muted-foreground">até</span>
          <div className="grid gap-1">
            <Label htmlFor="endDate" className="sr-only">Data final</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 w-[130px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
