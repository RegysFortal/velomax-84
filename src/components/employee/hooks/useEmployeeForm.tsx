
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useEmployeeForm(employee: User | null, isCreating: boolean, onComplete: () => void, onSave?: (employee: User, isNew: boolean) => void) {
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
      console.log("Loading employee data for editing:", employee);
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
          setPosition('Motorista');
          setCustomPosition('');
        } else if (lowerPos === 'ajudante') {
          setPositionType('ajudante');
          setPosition('Ajudante');
          setCustomPosition('');
        } else {
          setPositionType('outro');
          setCustomPosition(employee.position);
          setPosition(employee.position);
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
    console.log("Submitting employee form data");

    // Form validation
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      
      // Ensure we have all the required fields for updating
      const userData: User = {
        id: employee?.id || uuidv4(),
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
        role: employee?.role || 'user',
        createdAt: employee?.createdAt || currentDate,
        updatedAt: currentDate,
        email: employee?.email || ''
      };

      // Make sure we preserve any existing fields from the employee object
      // that might not be included in our form
      if (employee) {
        // Add type if it exists in original employee
        if (employee.type) {
          userData.type = employee.type;
        }
        
        // Preserve any other fields we don't explicitly manage
        if (employee.document) userData.document = employee.document;
        if (employee.username) userData.username = employee.username;
        if (employee.department) userData.department = employee.department;
        if (employee.vehicle) userData.vehicle = employee.vehicle;
        if (employee.license) userData.license = employee.license;
        if (employee.permissions) userData.permissions = employee.permissions;
      }

      console.log("Prepared user data for save:", userData);

      if (onSave) {
        await onSave(userData, isCreating);
        toast.success(isCreating ? "Colaborador adicionado com sucesso" : "Colaborador atualizado com sucesso");
        onComplete();
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error("Ocorreu um erro ao salvar. Tente novamente.");
    }
  };

  return {
    // Form values
    name,
    setName,
    rg,
    setRg,
    cpf,
    setCpf,
    birthDate,
    setBirthDate,
    positionType,
    setPositionType,
    customPosition,
    setCustomPosition,
    position,
    driverLicense,
    setDriverLicense,
    driverLicenseExpiry,
    setDriverLicenseExpiry,
    driverLicenseCategory,
    setDriverLicenseCategory,
    fatherName,
    setFatherName,
    motherName,
    setMotherName,
    address,
    setAddress,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    phone,
    setPhone,
    employeeSince,
    setEmployeeSince,
    // Methods
    handleSubmit
  };
}
