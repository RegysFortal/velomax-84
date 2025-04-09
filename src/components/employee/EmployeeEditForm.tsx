
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
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from '@/components/ui/use-toast';

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
  const { updateUserRole, addUser } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | 'manager'>('user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      setPassword('');
      setConfirmPassword('');
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
      toast({ title: "Erro", description: "Nome é obrigatório", variant: "destructive" });
      return;
    }

    if (!isEmployeeForm) {
      // For system users, we need email and username
      if (!email.trim() || !username.trim()) {
        toast({ title: "Erro", description: "Email e nome de usuário são obrigatórios", variant: "destructive" });
        return;
      }

      // Password validation for new users
      if (isCreating) {
        if (!password) {
          toast({ title: "Erro", description: "Senha é obrigatória para novos usuários", variant: "destructive" });
          return;
        }
        
        if (password.length < 6) {
          toast({ title: "Erro", description: "A senha deve ter pelo menos 6 caracteres", variant: "destructive" });
          return;
        }
        
        if (password !== confirmPassword) {
          toast({ title: "Erro", description: "As senhas não conferem", variant: "destructive" });
          return;
        }
      }
    }

    try {
      const userData: User = {
        id: employee?.id || '',
        name,
        email,
        username,
        role,
        position,
        department,
      };

      if (isEmployeeForm && onSave) {
        // For employee management (not system users)
        onSave(userData, isCreating);
        toast({
          title: isCreating ? "Colaborador adicionado" : "Colaborador atualizado",
          description: `${name} foi ${isCreating ? 'adicionado' : 'atualizado'} com sucesso.`
        });
      } else {
        // For system users
        if (isCreating) {
          // Create new user
          await addUser({
            email,
            password,
            username,
            name,
            role,
            position,
            department,
          });
          
          toast({
            title: "Usuário criado",
            description: `O usuário ${name} foi criado com sucesso.`
          });
        } else if (employee) {
          // Update existing user role
          await updateUserRole(employee.id, role);
          
          toast({
            title: "Usuário atualizado",
            description: `O usuário ${name} foi atualizado com sucesso.`
          });
        }
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving user/employee:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive"
      });
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

      {!isEmployeeForm && (
        <>
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
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="username"
            />
          </div>

          {isCreating && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="********"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="********"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Função no Sistema</Label>
            <Select value={role} onValueChange={(value) => setRole(value as 'user' | 'admin' | 'manager')}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuário Padrão</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

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
