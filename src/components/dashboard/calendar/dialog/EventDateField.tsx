
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EventDateFieldProps {
  eventDate: Date | undefined;
  setEventDate: (date: Date | undefined) => void;
}

export function EventDateField({ eventDate, setEventDate }: EventDateFieldProps) {
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      // Create date at noon local time to avoid timezone issues
      const [year, month, day] = dateString.split('-').map(Number);
      const newDate = new Date(year, month - 1, day, 12, 0, 0);
      setEventDate(newDate);
    } else {
      setEventDate(undefined);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="eventDate">Data do evento</Label>
      <Input
        id="eventDate"
        type="date"
        value={formatDateForInput(eventDate)}
        onChange={(e) => handleDateChange(e.target.value)}
      />
    </div>
  );
}
