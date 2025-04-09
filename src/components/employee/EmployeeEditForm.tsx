
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import the new component sections
import { PersonalInfoSection } from './forms/PersonalInfoSection';
import { PositionSection } from './forms/PositionSection';
import { DriverLicenseSection } from './forms/DriverLicenseSection';
import { AddressSection } from './forms/AddressSection';
import { EmploymentDetailsSection } from './forms/EmploymentDetailsSection';

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
        role: 'user',
        createdAt: employee?.createdAt || currentDate,
        updatedAt: currentDate,
        email: employee?.email || '',
        username: employee?.username || ''
      };

      if (onSave) {
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
    <form onSubmit={handleSubmit} className="space-y-4 h-[600px]">
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          <PersonalInfoSection
            name={name}
            setName={setName}
            rg={rg}
            setRg={setRg}
            cpf={cpf}
            setCpf={setCpf}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            fatherName={fatherName}
            setFatherName={setFatherName}
            motherName={motherName}
            setMotherName={setMotherName}
            phone={phone}
            setPhone={setPhone}
          />

          <PositionSection
            positionType={positionType}
            setPositionType={setPositionType}
            customPosition={customPosition}
            setCustomPosition={setCustomPosition}
          />

          {positionType === 'motorista' && (
            <DriverLicenseSection
              driverLicense={driverLicense}
              setDriverLicense={setDriverLicense}
              driverLicenseExpiry={driverLicenseExpiry}
              setDriverLicenseExpiry={setDriverLicenseExpiry}
              driverLicenseCategory={driverLicenseCategory}
              setDriverLicenseCategory={setDriverLicenseCategory}
            />
          )}

          <AddressSection
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />

          <EmploymentDetailsSection
            employeeSince={employeeSince}
            setEmployeeSince={setEmployeeSince}
          />
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 mt-4">
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
