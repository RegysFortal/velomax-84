
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DatePickerField } from '@/components/employee/forms/DatePickerField';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onDateRangeChange?: (start: string, end: string) => void;
  setStartDate?: (date: string) => void;
  setEndDate?: (date: string) => void;
}

export function DateRangeFilter({ 
  startDate, 
  endDate, 
  onDateRangeChange,
  setStartDate,
  setEndDate 
}: DateRangeFilterProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      if (setStartDate) {
        setStartDate(formattedDate);
      }
      if (onDateRangeChange) {
        onDateRangeChange(formattedDate, endDate);
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      if (setEndDate) {
        setEndDate(formattedDate);
      }
      if (onDateRangeChange) {
        onDateRangeChange(startDate, formattedDate);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <DatePickerField
              id="start-date"
              label="Data Inicial"
              value={startDate ? new Date(startDate) : undefined}
              onChange={handleStartDateChange}
              allowTyping={true}
            />
          </div>
          <div className="flex-1">
            <DatePickerField
              id="end-date"
              label="Data Final"
              value={endDate ? new Date(endDate) : undefined}
              onChange={handleEndDateChange}
              allowTyping={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
