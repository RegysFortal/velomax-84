import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { User } from '@/types';
import { useAuth } from '@/contexts/auth/AuthContext';
import { EmployeeEditForm } from '@/components/employee/EmployeeEditForm';
import { toast } from 'sonner';
import { useEmployeesData } from '@/hooks/useEmployeesData';

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-red-500">Administrador</Badge>;
    case 'manager':
      return <Badge className="bg-blue-500">Gerente</Badge>;
    default:
      return <Badge>Usuário</Badge>;
  }
};

const getPositionBadge = (position: string | undefined) => {
  if (!position) return null;
  
  switch (position.toLowerCase()) {
    case 'motorista':
      return <Badge className="bg-green-500">Motorista</Badge>;
    case 'ajudante':
      return <Badge className="bg-purple-500">Ajudante</Badge>;
    default:
      return <Badge className="bg-gray-500">{position}</Badge>;
  }
};

const getDepartmentLabel = (department: string | undefined) => {
  if (!department) return '-';
  
  switch (department) {
    case 'operations':
      return 'Operações';
    case 'finance':
      return 'Financeiro';
    case 'administrative':
      return 'Administrativo';
    case 'logistics':
      return 'Logística';
    case 'commercial':
      return 'Comercial';
    default:
      return department;
  }
};

export default function Employees() {
  const { user } = useAuth();
  const { employees, loading, addEmployee, updateEmployee, deleteEmployee } = useEmployeesData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const filteredEmployees = employees.filter(emp => {
    const searchText = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchText) ||
      (emp.email && emp.email.toLowerCase().includes(searchText)) ||
      (emp.position && emp.position.toLowerCase().includes(searchText)) ||
      (emp.department && emp.department.toLowerCase().includes(searchText))
    );
  });

  const handleEditClick = (employee: User) => {
    setSelectedEmployee(employee);
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Colaboradores</h1>
            <p className="text-muted-foreground">
              Gerencie os funcionários da empresa.
            </p>
          </div>
          <Button onClick={handleCreateClick} className="flex gap-2 items-center">
            <UserPlus className="h-4 w-4" />
            <span>Novo Colaborador</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lista de Colaboradores</CardTitle>
              <CardDescription>
                Total de {employees.length} colaboradores registrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar colaboradores..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">
                Carregando colaboradores...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Nenhum colaborador encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{emp.position ? getPositionBadge(emp.position) : '-'}</TableCell>
                        <TableCell>{getDepartmentLabel(emp.department)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(emp)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEmployee(emp.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
    </AppLayout>
  );
}
