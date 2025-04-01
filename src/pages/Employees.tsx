
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
import { useToast } from '@/components/ui/use-toast';
import { Edit, Plus, Search, UserCheck, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  role: z.enum(['driver', 'assistant'], {
    required_error: "Selecione uma função",
  }),
  dateOfBirth: z.string().optional(),
  rg: z.string().optional(),
  cpf: z.string().optional(),
  driverLicense: z.string().optional(),
  licenseCategory: z.string().optional(),
  licenseValidity: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().min(8, "O telefone deve ter no mínimo 8 caracteres"),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  employeeSince: z.string().min(1, "A data de início é obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

const Employees = () => {
  const { employees, addEmployee, updateEmployee } = useLogbook();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [licenseDate, setLicenseDate] = useState<Date | undefined>();
  const [employmentDate, setEmploymentDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: 'driver',
      dateOfBirth: '',
      rg: '',
      cpf: '',
      driverLicense: '',
      licenseCategory: '',
      licenseValidity: '',
      address: '',
      phone: '',
      motherName: '',
      fatherName: '',
      employeeSince: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  // Filtrar funcionários com base no termo de pesquisa
  const filteredEmployees = employees.filter(
    employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.cpf && employee.cpf.includes(searchTerm))
  );

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    
    // Set dates if they exist
    if (employee.dateOfBirth) {
      setBirthDate(new Date(employee.dateOfBirth));
    } else {
      setBirthDate(undefined);
    }
    
    if (employee.licenseValidity) {
      setLicenseDate(new Date(employee.licenseValidity));
    } else {
      setLicenseDate(undefined);
    }
    
    if (employee.employeeSince) {
      setEmploymentDate(new Date(employee.employeeSince));
    } else {
      setEmploymentDate(new Date());
    }
    
    form.reset({
      name: employee.name,
      role: employee.role,
      dateOfBirth: employee.dateOfBirth || '',
      rg: employee.rg || '',
      cpf: employee.cpf || '',
      driverLicense: employee.driverLicense || '',
      licenseCategory: employee.licenseCategory || '',
      licenseValidity: employee.licenseValidity || '',
      address: employee.address || '',
      phone: employee.phone || '',
      motherName: employee.motherName || '',
      fatherName: employee.fatherName || '',
      employeeSince: employee.employeeSince || format(new Date(), 'yyyy-MM-dd'),
    });
    setIsAddDialogOpen(true);
  };

  const onCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingEmployee(null);
    setBirthDate(undefined);
    setLicenseDate(undefined);
    setEmploymentDate(new Date());
    form.reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Set date values from the calendar popover components
      const formData = {
        ...data,
        dateOfBirth: birthDate ? format(birthDate, 'yyyy-MM-dd') : undefined,
        licenseValidity: licenseDate ? format(licenseDate, 'yyyy-MM-dd') : undefined,
        employeeSince: employmentDate ? format(employmentDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      };

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formData);
        toast({
          title: "Funcionário atualizado",
          description: `As informações de ${data.name} foram atualizadas.`,
        });
      } else {
        // Ensure all required properties are explicitly passed
        await addEmployee({
          name: formData.name,
          role: formData.role,
          employeeSince: formData.employeeSince,
          dateOfBirth: formData.dateOfBirth,
          rg: formData.rg,
          cpf: formData.cpf,
          driverLicense: formData.driverLicense,
          licenseCategory: formData.licenseCategory,
          licenseValidity: formData.licenseValidity,
          address: formData.address,
          phone: formData.phone,
          motherName: formData.motherName,
          fatherName: formData.fatherName
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
            <DialogContent className="max-w-3xl">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !birthDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthDate ? (
                              format(birthDate, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={birthDate}
                            onSelect={setBirthDate}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                    
                    <FormItem className="flex flex-col">
                      <FormLabel>Funcionário desde</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !employmentDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {employmentDate ? (
                              format(employmentDate, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={employmentDate}
                            onSelect={setEmploymentDate}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="rg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RG</FormLabel>
                          <FormControl>
                            <Input placeholder="00.000.000-0" {...field} />
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
                            <Input placeholder="000.000.000-00" {...field} />
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
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="driverLicense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNH</FormLabel>
                          <FormControl>
                            <Input placeholder="00000000000" {...field} />
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
                          <FormLabel>Categoria</FormLabel>
                          <FormControl>
                            <Input placeholder="A, B, AB, etc" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem className="flex flex-col">
                      <FormLabel>Validade</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !licenseDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {licenseDate ? (
                              format(licenseDate, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={licenseDate}
                            onSelect={setLicenseDate}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, número, bairro, cidade, UF" {...field} />
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
                            <Input placeholder="Maria Silva" {...field} />
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
                            <Input placeholder="João Silva" {...field} />
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
              placeholder="Pesquisar por nome ou CPF..."
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
                  <TableHead>CPF/RG</TableHead>
                  <TableHead>CNH</TableHead>
                  <TableHead>Funcionário desde</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role === 'driver' ? 'Motorista' : 'Ajudante'}</TableCell>
                    <TableCell>{employee.cpf || employee.rg || '-'}</TableCell>
                    <TableCell>{employee.driverLicense || '-'}</TableCell>
                    <TableCell>{employee.employeeSince ? format(new Date(employee.employeeSince), 'dd/MM/yyyy') : '-'}</TableCell>
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
