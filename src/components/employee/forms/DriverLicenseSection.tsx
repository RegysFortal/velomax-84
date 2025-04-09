
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
  );
}
