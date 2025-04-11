
import { DatePickerField } from './DatePickerField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DriverLicenseSectionProps {
  driverLicense: string;
  setDriverLicense: (value: string) => void;
  driverLicenseExpiry: Date | undefined;
  setDriverLicenseExpiry: (date: Date | undefined) => void;
  driverLicenseCategory: string;
  setDriverLicenseCategory: (value: string) => void;
}

export function DriverLicenseSection({
  driverLicense,
  setDriverLicense,
  driverLicenseExpiry,
  setDriverLicenseExpiry,
  driverLicenseCategory,
  setDriverLicenseCategory
}: DriverLicenseSectionProps) {
  return (
    <div className="space-y-4 bg-muted/30 p-4 rounded-md">
      <h3 className="font-medium text-md">Carteira de Habilitação</h3>
      
      <div className="grid gap-2">
        <Label htmlFor="driverLicense">Número da CNH</Label>
        <Input
          id="driverLicense"
          value={driverLicense}
          onChange={(e) => setDriverLicense(e.target.value)}
          placeholder="Número da carteira de habilitação"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="driverLicenseExpiry">Validade da CNH</Label>
        <DatePickerField
          id="driverLicenseExpiry"
          value={driverLicenseExpiry}
          onChange={setDriverLicenseExpiry}
          placeholder="Selecione ou digite a data de validade"
          allowTyping={true}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="driverLicenseCategory">Categoria da CNH</Label>
        <Select
          value={driverLicenseCategory}
          onValueChange={setDriverLicenseCategory}
        >
          <SelectTrigger id="driverLicenseCategory">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
            <SelectItem value="E">E</SelectItem>
            <SelectItem value="AB">AB</SelectItem>
            <SelectItem value="AC">AC</SelectItem>
            <SelectItem value="AD">AD</SelectItem>
            <SelectItem value="AE">AE</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
