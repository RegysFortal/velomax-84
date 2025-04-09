
import { DatePickerField } from './DatePickerField';

interface EmploymentDetailsSectionProps {
  employeeSince: Date | undefined;
  setEmployeeSince: (date: Date | undefined) => void;
}

export function EmploymentDetailsSection({
  employeeSince,
  setEmployeeSince
}: EmploymentDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <DatePickerField
        id="employeeSince"
        label="Funcionário Desde"
        value={employeeSince}
        onChange={setEmployeeSince}
      />
    </div>
  );
}
