
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { DatePickerField } from './forms/DatePickerField';
import { User } from '@/types';
import { useEmployeeForm } from './hooks/useEmployeeForm';

const employeeSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  position: z.string().min(1, { message: 'Posição é obrigatória' }),
  phone: z.string().optional(),
  department: z.string().optional(),
  employeeSince: z.string().optional(),
});

interface EmployeeEditFormProps {
  employee: User | null;
  isCreating?: boolean;
  onComplete?: () => void;
  onSave?: (employee: User, isNew: boolean) => Promise<void>;
  isEmployeeForm?: boolean;
}

export function EmployeeEditForm({
  employee,
  isCreating = false,
  onComplete,
  onSave,
  isEmployeeForm = false
}: EmployeeEditFormProps) {
  // Use the complete employee form hook
  const employeeForm = useEmployeeForm(employee, isCreating, onComplete || (() => {}), onSave);

  return (
    <div className="space-y-6">
      <form onSubmit={employeeForm.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Nome Completo *</label>
            <Input
              id="name"
              value={employeeForm.name}
              onChange={(e) => employeeForm.setName(e.target.value)}
              placeholder="Nome do colaborador"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
            <Input
              id="phone"
              value={employeeForm.phone}
              onChange={(e) => employeeForm.setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="rg" className="text-sm font-medium">RG</label>
            <Input
              id="rg"
              value={employeeForm.rg}
              onChange={(e) => employeeForm.setRg(e.target.value)}
              placeholder="Número do RG"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
            <Input
              id="cpf"
              value={employeeForm.cpf}
              onChange={(e) => employeeForm.setCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="birthDate" className="text-sm font-medium">Data de Nascimento</label>
            <DatePickerField
              date={employeeForm.birthDate}
              onDateChange={employeeForm.setBirthDate}
              placeholder="Selecione a data"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="employeeSince" className="text-sm font-medium">Data de Admissão</label>
            <DatePickerField
              date={employeeForm.employeeSince}
              onDateChange={employeeForm.setEmployeeSince}
              placeholder="Selecione a data"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="positionType" className="text-sm font-medium">Cargo *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="motorista"
                name="positionType"
                checked={employeeForm.positionType === 'motorista'}
                onChange={() => employeeForm.setPositionType('motorista')}
                className="rounded-full"
              />
              <label htmlFor="motorista">Motorista</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="ajudante"
                name="positionType"
                checked={employeeForm.positionType === 'ajudante'}
                onChange={() => employeeForm.setPositionType('ajudante')}
                className="rounded-full"
              />
              <label htmlFor="ajudante">Ajudante</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="outro"
                name="positionType"
                checked={employeeForm.positionType === 'outro'}
                onChange={() => employeeForm.setPositionType('outro')}
                className="rounded-full"
              />
              <label htmlFor="outro">Outro</label>
            </div>
          </div>
          {employeeForm.positionType === 'outro' && (
            <Input
              value={employeeForm.customPosition}
              onChange={(e) => employeeForm.setCustomPosition(e.target.value)}
              placeholder="Especifique o cargo"
              className="mt-2"
            />
          )}
        </div>

        {employeeForm.positionType === 'motorista' && (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">Informações do Motorista</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="driverLicense" className="text-sm font-medium">CNH</label>
                <Input
                  id="driverLicense"
                  value={employeeForm.driverLicense}
                  onChange={(e) => employeeForm.setDriverLicense(e.target.value)}
                  placeholder="Número da CNH"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="driverLicenseCategory" className="text-sm font-medium">Categoria</label>
                <Select
                  value={employeeForm.driverLicenseCategory}
                  onValueChange={employeeForm.setDriverLicenseCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
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

            <div className="space-y-2">
              <label htmlFor="driverLicenseExpiry" className="text-sm font-medium">Validade da CNH</label>
              <DatePickerField
                date={employeeForm.driverLicenseExpiry}
                onDateChange={employeeForm.setDriverLicenseExpiry}
                placeholder="Selecione a data"
              />
            </div>
          </div>
        )}

        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="font-medium">Informações Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fatherName" className="text-sm font-medium">Nome do Pai</label>
              <Input
                id="fatherName"
                value={employeeForm.fatherName}
                onChange={(e) => employeeForm.setFatherName(e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="motherName" className="text-sm font-medium">Nome da Mãe</label>
              <Input
                id="motherName"
                value={employeeForm.motherName}
                onChange={(e) => employeeForm.setMotherName(e.target.value)}
                placeholder="Nome completo"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="font-medium">Endereço</h3>
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Logradouro</label>
            <Input
              id="address"
              value={employeeForm.address}
              onChange={(e) => employeeForm.setAddress(e.target.value)}
              placeholder="Rua, Avenida, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">Cidade</label>
              <Input
                id="city"
                value={employeeForm.city}
                onChange={(e) => employeeForm.setCity(e.target.value)}
                placeholder="Nome da cidade"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">Estado</label>
              <Input
                id="state"
                value={employeeForm.state}
                onChange={(e) => employeeForm.setState(e.target.value)}
                placeholder="UF"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="zipCode" className="text-sm font-medium">CEP</label>
              <Input
                id="zipCode"
                value={employeeForm.zipCode}
                onChange={(e) => employeeForm.setZipCode(e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancelar
          </Button>
          <Button type="submit">
            {isCreating ? 'Criar Colaborador' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
