
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/types';
import { useEmployeeForm } from './hooks/useEmployeeForm';

// Import the component sections
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
  console.log("EmployeeEditForm - Initial employee data:", employee);
  
  const {
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
    handleSubmit
  } = useEmployeeForm(employee, isCreating, onComplete, onSave);

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
