
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Employee as EmployeeType } from '@/types';
import { useLogbook } from '@/contexts/LogbookContext';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  role: z.enum(['driver', 'assistant', 'admin'], {
    required_error: "Selecione uma função.",
  }),
  employeeSince: z.string({
    required_error: "Selecione a data de admissão.",
  }),
  dateOfBirth: z.string({
    required_error: "Selecione a data de nascimento.",
  }),
  rg: z.string().optional(),
  cpf: z.string().optional(),
  driverLicense: z.string().optional(),
  licenseCategory: z.string().optional(),
  licenseValidity: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 caracteres.",
  }),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Employees = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeType | null>(null);
  const { employees, addEmployee, updateEmployee } = useLogbook();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "driver",
      employeeSince: "",
      dateOfBirth: "",
      rg: "",
      cpf: "",
      driverLicense: "",
      licenseCategory: "",
      licenseValidity: "",
      address: "",
      phone: "",
      motherName: "",
      fatherName: "",
    },
  });

  useEffect(() => {
    if (editingEmployee) {
      form.reset({
        name: editingEmployee.name,
        role: editingEmployee.role === 'admin' ? 'admin' : editingEmployee.role,
        employeeSince: editingEmployee.employeeSince || "",
        dateOfBirth: editingEmployee.dateOfBirth || "",
        rg: editingEmployee.rg || "",
        cpf: editingEmployee.cpf || "",
        driverLicense: editingEmployee.driverLicense || "",
        licenseCategory: editingEmployee.licenseCategory || "",
        licenseValidity: editingEmployee.licenseValidity || "",
        address: editingEmployee.address || "",
        phone: editingEmployee.phone,
        motherName: editingEmployee.motherName || "",
        fatherName: editingEmployee.fatherName || "",
      });
    }
  }, [editingEmployee, form]);

  const handleOpenDialog = () => {
    setEditingEmployee(null);
    setDialogOpen(true);
    resetForm();
  };

  const handleEditEmployee = (employee: EmployeeType) => {
    setEditingEmployee(employee);
    setDialogOpen(true);
  };

  const resetForm = () => {
    form.reset({
      name: "",
      role: "driver",
      employeeSince: "",
      dateOfBirth: "",
      rg: "",
      cpf: "",
      driverLicense: "",
      licenseCategory: "",
      licenseValidity: "",
      address: "",
      phone: "",
      motherName: "",
      fatherName: "",
    });
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          ...values,
          status: 'active',
          role: editingEmployee.role === 'admin' ? 'admin' : values.role,
          position: values.role === 'driver' ? 'Motorista' : 'Assistente',
        });
        toast({
          title: "Funcionário atualizado",
          description: `O funcionário ${values.name} foi atualizado com sucesso.`
        });
      } else {
        await addEmployee({
          name: values.name, // Ensure name is provided
          role: values.role,
          status: 'active',
          position: values.role === 'driver' ? 'Motorista' : 'Assistente',
          address: values.address,
          employeeSince: values.employeeSince,
          dateOfBirth: values.dateOfBirth,
          rg: values.rg,
          cpf: values.cpf,
          driverLicense: values.driverLicense,
          licenseCategory: values.licenseCategory,
          licenseValidity: values.licenseValidity,
          phone: values.phone,
          motherName: values.motherName,
          fatherName: values.fatherName,
        });
        toast({
          title: "Funcionário adicionado",
          description: `O funcionário ${values.name} foi adicionado com sucesso.`
        });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o funcionário.",
        variant: "destructive"
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
              Gerencie os funcionários da sua empresa.
            </p>
          </div>
          <Button onClick={handleOpenDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Funcionário
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">
              Lista de Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role === 'driver' ? 'Motorista' : employee.role === 'assistant' ? 'Ajudante' : 'Admin'}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Editar Funcionário" : "Adicionar Funcionário"}</DialogTitle>
              <DialogDescription>
                Preencha os dados do funcionário abaixo.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                    name="employeeSince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admissão</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RG</FormLabel>
                        <FormControl>
                          <Input placeholder="RG" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="CPF" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="driverLicense"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNH</FormLabel>
                        <FormControl>
                          <Input placeholder="Número da CNH" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria CNH</FormLabel>
                        <FormControl>
                          <Input placeholder="Categoria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="licenseValidity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validade CNH</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                          <Input placeholder="(99) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Mãe</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Pai</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
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
    </AppLayout>
  );
};

export default Employees;
