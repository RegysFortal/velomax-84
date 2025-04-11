
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DatePickerField } from '@/components/employee/forms/DatePickerField';

interface DateRangeFilterProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

export function DateRangeFilter({ 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate 
}: DateRangeFilterProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEndDate(date.toISOString().split('T')[0]);
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
