
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Employee, LogbookEntry } from '@/types';

interface EmployeeStatusCardProps {
  employees: Employee[];
  filteredEntries: LogbookEntry[];
}

export const EmployeeStatusCard: React.FC<EmployeeStatusCardProps> = ({ 
  employees,
  filteredEntries
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">Funcionários</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Equipe em serviço</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map(employee => {
            const isWorking = filteredEntries.some(
              entry => (entry.driverId === employee.id || entry.assistantId === employee.id) && !entry.returnTime
            );
            
            return (
              <div key={employee.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.position === 'driver' ? 'Motorista' : 'Ajudante'}</p>
                </div>
                <div>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    isWorking 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  )}>
                    {isWorking ? 'Em serviço' : 'Disponível'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
