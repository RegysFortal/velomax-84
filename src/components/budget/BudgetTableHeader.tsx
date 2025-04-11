
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchWithMagnifier } from '@/components/ui/search-with-magnifier';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface BudgetTableHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
}

export function BudgetTableHeader({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter
}: BudgetTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full">
      <SearchWithMagnifier
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por cliente..."
        className="w-full sm:w-80"
      />
      
      <div className="flex items-center ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateFilter && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, 'dd/MM/yyyy') : "Filtrar por data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
            />
            {dateFilter && (
              <div className="p-3 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center"
                  onClick={() => setDateFilter(undefined)}
                >
                  Limpar filtro
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
