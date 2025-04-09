
import { useState } from 'react';
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
  const { users, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(u => {
    const searchText = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(searchText) ||
      u.email.toLowerCase().includes(searchText) ||
      (u.position && u.position.toLowerCase().includes(searchText)) ||
      (u.department && u.department.toLowerCase().includes(searchText))
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

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Colaboradores</h1>
            <p className="text-muted-foreground">
              Gerencie os funcionários e suas permissões.
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
                Total de {users.length} colaboradores registrados
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      Nenhum colaborador encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{getRoleBadge(u.role)}</TableCell>
                      <TableCell>{u.position ? getPositionBadge(u.position) : '-'}</TableCell>
                      <TableCell>{getDepartmentLabel(u.department)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(u)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isCreating ? 'Novo Colaborador' : 'Editar Colaborador'}</DialogTitle>
              <DialogDescription>
                {isCreating 
                  ? 'Adicione um novo colaborador ao sistema.'
                  : 'Altere as informações e permissões do colaborador.'}
              </DialogDescription>
            </DialogHeader>
            <EmployeeEditForm 
              employee={selectedEmployee}
              isCreating={isCreating}
              onComplete={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
