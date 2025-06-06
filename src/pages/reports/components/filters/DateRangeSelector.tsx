
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { toISODateString, fromISODateString } from '@/utils/dateUtils';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangeSelectorProps) {
  // Convert string dates to Date objects for DatePicker
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(
    startDate ? fromISODateString(startDate) : undefined
  );
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(
    endDate ? fromISODateString(endDate) : undefined
  );
  
  // Update local date objects when props change
  useEffect(() => {
    if (startDate) {
      setStartDateObj(fromISODateString(startDate));
    } else {
      setStartDateObj(undefined);
    }
    
    if (endDate) {
      setEndDateObj(fromISODateString(endDate));
    } else {
      setEndDateObj(undefined);
    }
  }, [startDate, endDate]);
  
  // Handle date selection from DatePicker
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDateObj(date);
    if (date) {
      const isoDate = toISODateString(date);
      console.log('DateRangeSelector - Selected start date:', date, 'Converting to ISO:', isoDate);
      onStartDateChange(isoDate);
    }
  };
  
  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDateObj(date);
    if (date) {
      const isoDate = toISODateString(date);
      console.log('DateRangeSelector - Selected end date:', date, 'Converting to ISO:', isoDate);
      onEndDateChange(isoDate);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Data Inicial</label>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <DatePicker
            date={startDateObj}
            onSelect={handleStartDateSelect}
            placeholder="Selecione a data inicial"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Data Final</label>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <DatePicker
            date={endDateObj}
            onSelect={handleEndDateSelect}
            placeholder="Selecione a data final"
          />
        </div>
      </div>
    </div>
  );
}
