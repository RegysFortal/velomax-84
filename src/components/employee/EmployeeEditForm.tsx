
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { toast } from 'sonner';

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
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | 'manager'>('user');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState<string>('');
  const [positionType, setPositionType] = useState<'motorista' | 'ajudante' | 'outro'>('outro');
  const [customPosition, setCustomPosition] = useState('');

  // Load employee data if editing
  useEffect(() => {
    if (employee) {
      setName(employee.name || '');
      setEmail(employee.email || '');
      setUsername(employee.username || '');
      setRole(employee.role as 'user' | 'admin' | 'manager');
      setPosition(employee.position || '');
      setDepartment(employee.department || '');
      
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
      setEmail('');
      setUsername('');
      setRole('user');
      setPosition('');
      setDepartment('');
      setPositionType('outro');
      setCustomPosition('');
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
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@velomax.com`,
        username: username || name.toLowerCase().replace(/\s+/g, '.'),
        role,
        position,
        department,
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
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="email@exemplo.com"
        />
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

      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger id="department">
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operations">Operações</SelectItem>
            <SelectItem value="logistics">Logística</SelectItem>
            <SelectItem value="administrative">Administrativo</SelectItem>
            <SelectItem value="finance">Financeiro</SelectItem>
            <SelectItem value="commercial">Comercial</SelectItem>
          </SelectContent>
        </Select>
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
