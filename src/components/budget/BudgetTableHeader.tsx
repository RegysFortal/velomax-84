
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BudgetTableHeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  dateFilter: Date | undefined;
  setDateFilter: React.Dispatch<React.SetStateAction<Date | undefined>>;
  requestSort?: (key: string) => void;
  sortConfig?: { key: string; direction: 'ascending' | 'descending' } | null;
}

export function BudgetTableHeader({ 
  searchTerm, 
  setSearchTerm, 
  dateFilter, 
  setDateFilter,
  requestSort,
  sortConfig
}: BudgetTableHeaderProps) {
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            {dateFilter 
              ? format(dateFilter, "dd/MM/yyyy", { locale: ptBR })
              : "Filtrar por data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            mode="single"
            selected={dateFilter}
            onSelect={setDateFilter}
            locale={ptBR}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {dateFilter && (
        <Button 
          variant="ghost" 
          onClick={() => setDateFilter(undefined)}
          className="w-full sm:w-auto"
        >
          Limpar Filtro
        </Button>
      )}
    </div>
  );
}
