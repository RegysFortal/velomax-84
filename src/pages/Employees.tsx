
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogbook } from '@/contexts/LogbookContext';
import { Employee } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Search, UserCheck } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  role: z.enum(['driver', 'assistant'], {
    required_error: "Selecione uma função",
  }),
  documentId: z.string().min(5, "O documento deve ter no mínimo 5 caracteres"),
  phone: z.string().min(8, "O telefone deve ter no mínimo 8 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

const Employees = () => {
  const { employees, addEmployee, updateEmployee } = useLogbook();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: 'driver',
      documentId: '',
      phone: '',
    },
  });

  // Filtrar funcionários com base no termo de pesquisa
  const filteredEmployees = employees.filter(
    employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.documentId.includes(searchTerm)
  );

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    form.reset({
      name: employee.name,
      role: employee.role,
      documentId: employee.documentId,
      phone: employee.phone,
    });
    setIsAddDialogOpen(true);
  };

  const onCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingEmployee(null);
    form.reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, data);
        toast({
          title: "Funcionário atualizado",
          description: `As informações de ${data.name} foram atualizadas.`,
        });
      } else {
        // Ensure all required properties are explicitly passed
        await addEmployee({
          name: data.name,
          role: data.role,
          documentId: data.documentId,
          phone: data.phone
        });
        toast({
          title: "Funcionário adicionado",
          description: `${data.name} foi adicionado com sucesso.`,
        });
      }
      onCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o funcionário.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
            <p className="text-muted-foreground">
              Gerenciamento de motoristas e ajudantes.
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo funcionário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? "Editar funcionário" : "Adicionar novo funcionário"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do funcionário e clique em salvar.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="João Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="driver">Motorista</SelectItem>
                            <SelectItem value="assistant">Ajudante</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="documentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF/RG</FormLabel>
                          <FormControl>
                            <Input placeholder="123.456.789-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 98765-4321" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={onCloseDialog}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingEmployee ? "Atualizar" : "Salvar"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar por nome ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <UserCheck className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {searchTerm ? "Nenhum funcionário encontrado." : "Nenhum funcionário cadastrado."}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar novo funcionário
            </Button>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role === 'driver' ? 'Motorista' : 'Ajudante'}</TableCell>
                    <TableCell>{employee.documentId}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(employee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Employees;
