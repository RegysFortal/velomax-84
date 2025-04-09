
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerField } from './DatePickerField';

interface PersonalInfoSectionProps {
  name: string;
  setName: (value: string) => void;
  rg: string;
  setRg: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  birthDate: Date | undefined;
  setBirthDate: (date: Date | undefined) => void;
  fatherName: string;
  setFatherName: (value: string) => void;
  motherName: string;
  setMotherName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
}

export function PersonalInfoSection({
  name,
  setName,
  rg,
  setRg,
  cpf,
  setCpf,
  birthDate,
  setBirthDate,
  fatherName,
  setFatherName,
  motherName,
  setMotherName,
  phone,
  setPhone
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
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

      <DatePickerField
        id="birthDate"
        label="Data de Nascimento"
        value={birthDate}
        onChange={setBirthDate}
      />

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
        <Label htmlFor="phone">Telefone</Label>
        <Input 
          id="phone" 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="(00) 00000-0000"
        />
      </div>
    </div>
  );
}
