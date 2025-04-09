
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EmployeeEditFormProps {
  employee: User | null;
  isCreating: boolean;
  onComplete: () => void;
  onSave?: (employee: User, isNew: boolean) => void;
  isEmployeeForm?: boolean;
}

export function EmployeeEditForm({
  employee,
  isCreating,
  onComplete,
  onSave,
  isEmployeeForm = false
}: EmployeeEditFormProps) {
  // Form state
  const [name, setName] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [positionType, setPositionType] = useState<'motorista' | 'ajudante' | 'outro'>('outro');
  const [customPosition, setCustomPosition] = useState('');
  const [position, setPosition] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverLicenseExpiry, setDriverLicenseExpiry] = useState<Date | undefined>(undefined);
  const [driverLicenseCategory, setDriverLicenseCategory] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeSince, setEmployeeSince] = useState<Date | undefined>(undefined);

  // Load employee data if editing
  useEffect(() => {
    if (employee) {
      setName(employee.name || '');
      setRg(employee.rg || '');
      setCpf(employee.cpf || '');
      setBirthDate(employee.birthDate ? new Date(employee.birthDate) : undefined);
      setPhone(employee.phone || '');
      setDriverLicense(employee.driverLicense || '');
      setDriverLicenseExpiry(employee.driverLicenseExpiry ? new Date(employee.driverLicenseExpiry) : undefined);
      setDriverLicenseCategory(employee.driverLicenseCategory || '');
      setFatherName(employee.fatherName || '');
      setMotherName(employee.motherName || '');
      setAddress(employee.address || '');
      setCity(employee.city || '');
      setState(employee.state || '');
      setZipCode(employee.zipCode || '');
      setEmployeeSince(employee.employeeSince ? new Date(employee.employeeSince) : undefined);
      
      // Set position type based on existing position
      if (employee.position) {
        const lowerPos = employee.position.toLowerCase();
        if (lowerPos === 'motorista') {
          setPositionType('motorista');
          setCustomPosition('');
        } else if (lowerPos === 'ajudante') {
          setPositionType('ajudante');
          setCustomPosition('');
        } else {
          setPositionType('outro');
          setCustomPosition(employee.position);
        }
      }
    } else {
      // Reset form for new employee
      setName('');
      setRg('');
      setCpf('');
      setBirthDate(undefined);
      setPhone('');
      setPositionType('outro');
      setCustomPosition('');
      setPosition('');
      setDriverLicense('');
      setDriverLicenseExpiry(undefined);
      setDriverLicenseCategory('');
      setFatherName('');
      setMotherName('');
      setAddress('');
      setCity('');
      setState('');
      setZipCode('');
      setEmployeeSince(undefined);
    }
  }, [employee]);

  // Update position whenever position type changes
  useEffect(() => {
    if (positionType === 'motorista') {
      setPosition('Motorista');
    } else if (positionType === 'ajudante') {
      setPosition('Ajudante');
    } else if (positionType === 'outro' && customPosition) {
      setPosition(customPosition);
    }
  }, [positionType, customPosition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      
      const userData: User = {
        id: employee?.id || `emp-${Date.now()}`,
        name,
        rg,
        cpf,
        birthDate: birthDate?.toISOString(),
        position,
        driverLicense: positionType === 'motorista' ? driverLicense : undefined,
        driverLicenseExpiry: positionType === 'motorista' ? driverLicenseExpiry?.toISOString() : undefined,
        driverLicenseCategory: positionType === 'motorista' ? driverLicenseCategory : undefined,
        fatherName,
        motherName,
        address,
        city,
        state,
        zipCode,
        phone,
        employeeSince: employeeSince?.toISOString(),
        // These fields are still required by the User type
        email: employee?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@velomax.com`,
        username: employee?.username || name.toLowerCase().replace(/\s+/g, '.'),
        role: employee?.role || 'user',
        createdAt: employee?.createdAt || currentDate,
        updatedAt: currentDate
      };

      if (onSave) {
        // For employee management
        onSave(userData, isCreating);
        toast.success(isCreating ? "Colaborador adicionado" : "Colaborador atualizado");
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error("Ocorreu um erro ao salvar. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo*</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nome completo"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input 
            id="rg" 
            value={rg} 
            onChange={(e) => setRg(e.target.value)} 
            placeholder="Registro Geral"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input 
            id="cpf" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            placeholder="000.000.000-00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !birthDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDate ? format(birthDate, "dd/MM/yyyy", {locale: ptBR}) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Cargo</Label>
        <RadioGroup value={positionType} onValueChange={(value) => setPositionType(value as 'motorista' | 'ajudante' | 'outro')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="motorista" id="motorista" />
            <Label htmlFor="motorista">Motorista</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ajudante" id="ajudante" />
            <Label htmlFor="ajudante">Ajudante</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outro" id="outro" />
            <Label htmlFor="outro">Outro</Label>
          </div>
        </RadioGroup>
        
        {positionType === 'outro' && (
          <div className="mt-2">
            <Input 
              value={customPosition} 
              onChange={(e) => setCustomPosition(e.target.value)} 
              placeholder="Especifique o cargo"
            />
          </div>
        )}
      </div>

      {positionType === 'motorista' && (
        <div className="space-y-4 p-4 border rounded-md bg-slate-50">
          <div className="space-y-2">
            <Label htmlFor="driverLicense">Número da CNH</Label>
            <Input 
              id="driverLicense" 
              value={driverLicense} 
              onChange={(e) => setDriverLicense(e.target.value)} 
              placeholder="Número da CNH"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="driverLicenseExpiry">Validade da Habilitação</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !driverLicenseExpiry && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {driverLicenseExpiry ? format(driverLicenseExpiry, "dd/MM/yyyy", {locale: ptBR}) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={driverLicenseExpiry}
                  onSelect={setDriverLicenseExpiry}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="driverLicenseCategory">Categoria da Habilitação</Label>
            <Input 
              id="driverLicenseCategory" 
              value={driverLicenseCategory} 
              onChange={(e) => setDriverLicenseCategory(e.target.value)} 
              placeholder="Ex: A, B, C, D, E"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fatherName">Nome do Pai</Label>
          <Input 
            id="fatherName" 
            value={fatherName} 
            onChange={(e) => setFatherName(e.target.value)} 
            placeholder="Nome completo do pai"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherName">Nome da Mãe</Label>
          <Input 
            id="motherName" 
            value={motherName} 
            onChange={(e) => setMotherName(e.target.value)} 
            placeholder="Nome completo da mãe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo</Label>
        <Input 
          id="address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          placeholder="Rua, número, complemento"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input 
            id="city" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="Cidade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input 
            id="state" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            placeholder="Estado"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input 
            id="zipCode" 
            value={zipCode} 
            onChange={(e) => setZipCode(e.target.value)} 
            placeholder="00000-000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input 
          id="phone" 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="(00) 00000-0000"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeeSince">Funcionário Desde</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !employeeSince && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {employeeSince ? format(employeeSince, "dd/MM/yyyy", {locale: ptBR}) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={employeeSince}
              onSelect={setEmployeeSince}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit">
          {isCreating ? 'Criar' : 'Atualizar'}
        </Button>
      </div>
    </form>
  );
}
