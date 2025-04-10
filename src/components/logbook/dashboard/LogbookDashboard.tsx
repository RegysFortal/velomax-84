
import React from 'react';
import { Vehicle, Employee, LogbookEntry } from '@/types';
import { VehicleStatusCard } from './VehicleStatusCard';
import { EmployeeStatusCard } from './EmployeeStatusCard';
import { AlertsCard } from './AlertsCard';

interface LogbookDashboardProps {
  vehicles: Vehicle[];
  employees: Employee[];
  filteredEntries: LogbookEntry[];
}

export const LogbookDashboard: React.FC<LogbookDashboardProps> = ({
  vehicles,
  employees,
  filteredEntries
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <VehicleStatusCard vehicles={vehicles} />
      <EmployeeStatusCard employees={employees} filteredEntries={filteredEntries} />
      <AlertsCard vehicles={vehicles} />
    </div>
  );
};
