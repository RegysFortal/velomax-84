
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types';
import { useEmployeesData } from '@/hooks/useEmployeesData';
import { EmployeeEditForm } from '@/components/employee/EmployeeEditForm';
import { toast } from 'sonner';
import { EmployeesHeader } from '@/components/employee/EmployeesHeader';
import { EmployeesTable } from '@/components/employee/EmployeesTable';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Employees() {
  const { employees, loading, addEmployee, updateEmployee, deleteEmployee } = useEmployeesData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleEditClick = (employee: User) => {
    setSelectedEmployee(JSON.parse(JSON.stringify(employee)));
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedEmployee(null);
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (employee: User, isNew: boolean) => {
    try {
      if (isNew) {
        await addEmployee(employee);
        toast.success("Colaborador adicionado com sucesso");
      } else {
        await updateEmployee(employee);
        toast.success("Colaborador atualizado com sucesso");
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(isNew ? "Erro ao adicionar colaborador" : "Erro ao atualizar colaborador");
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await deleteEmployee(id);
        toast.success("Colaborador excluído com sucesso");
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error("Erro ao excluir colaborador");
      }
    }
  };

  return (
    <AppLayout>
      <ScrollArea className="h-[calc(100vh-120px)] w-full">
        <div className="flex flex-col gap-6 p-6">
          <EmployeesHeader onCreateClick={handleCreateClick} />
          
          <EmployeesTable
            employees={employees}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteEmployee}
          />

          <Dialog 
            open={isDialogOpen} 
            onOpenChange={(open) => {
              if (!open) {
                handleCloseDialog();
              } else {
                setIsDialogOpen(open);
              }
            }}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isCreating ? 'Novo Colaborador' : 'Editar Colaborador'}</DialogTitle>
                <DialogDescription>
                  {isCreating 
                    ? 'Adicione um novo colaborador ao sistema.'
                    : 'Altere as informações do colaborador.'}
                </DialogDescription>
              </DialogHeader>
              <EmployeeEditForm 
                employee={selectedEmployee}
                isCreating={isCreating}
                onComplete={handleCloseDialog}
                onSave={handleSaveEmployee}
                isEmployeeForm={true}
              />
            </DialogContent>
          </Dialog>
        </div>
      </ScrollArea>
    </AppLayout>
  );
}
