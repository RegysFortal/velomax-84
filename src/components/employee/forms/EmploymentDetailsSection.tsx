
import { DatePickerField } from './DatePickerField';

interface EmploymentDetailsSectionProps {
  employeeSince: Date | undefined;
  setEmployeeSince: (date: Date | undefined) => void;
}

export function EmploymentDetailsSection({
  employeeSince,
  setEmployeeSince
}: EmploymentDetailsSectionProps) {
  // Handle date selection with proper logging
  const handleDateChange = (date: Date | undefined) => {
    console.log('Employee start date changed:', date);
    setEmployeeSince(date);
  };

  return (
    <div className="space-y-4">
      <DatePickerField
        id="employeeSince"
        label="Funcionário Desde"
        value={employeeSince}
        onChange={handleDateChange}
      />
    </div>
  );
}
