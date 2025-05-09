
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployeesData } from '@/hooks/useEmployeesData';
import { toast } from 'sonner';
import { EmployeesTable } from '@/components/employee/EmployeesTable';
import { User } from '@/types';

export function EmployeesManagement() {
  const { employees, loading, updateEmployee, deleteEmployee } = useEmployeesData();
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditEmployee = (id: string) => {
    toast.info("Edição de funcionário", {
      description: `Para editar detalhes completos do funcionário, acesse a página Funcionários.`
    });
  };

  const handleDeleteEmployee = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await deleteEmployee(id);
        toast.success("Funcionário excluído com sucesso");
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error("Erro ao excluir funcionário");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Funcionários</CardTitle>
          <CardDescription>
            Visualize e gerencie os colaboradores da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <EmployeesTable
              employees={employees}
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEditClick={(employee: User) => handleEditEmployee(employee.id)}
              onDeleteClick={handleDeleteEmployee}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
