import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MetropolitanCitiesSection } from './MetropolitanCitiesSection';
import { PriceTable, City } from '@/types';
import { RatesFormSection } from './RatesFormSection';

interface PriceTableFormData extends Omit<PriceTable, 'id' | 'createdAt' | 'updatedAt'> {
  metropolitanCityIds?: string[];
}

interface PriceTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PriceTableFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingPriceTable: PriceTable | null;
  selectedCities: string[];
  cities: City[];
  onCityToggle: (cityId: string) => void;
  onCreateNewCity: (cityName: string) => void;
  onCheckboxChange: (checked: boolean) => void;
}

export function PriceTableDialog({
  open,
  onOpenChange,
  formData,
  onChange,
  onSubmit,
  editingPriceTable,
  selectedCities,
  cities,
  onCityToggle,
  onCreateNewCity,
  onCheckboxChange,
}: PriceTableDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <ScrollArea className="h-[80vh]">
          <div className="p-4">
            <DialogHeader>
              <DialogTitle>{editingPriceTable ? 'Editar Tabela de Preços' : 'Nova Tabela de Preços'}</DialogTitle>
              <DialogDescription>
                Configure os valores padrão para esta tabela de preços.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-6 mt-4">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <Label htmlFor="name">Nome da Tabela</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={onChange}
                  />
                </div>
              </div>

              {/* Rate Sections */}
              <RatesFormSection formData={formData} onChange={onChange} />

              {/* Additional Settings */}
              <div className="border p-4 rounded-md">
                <h3 className="font-medium mb-4 text-lg">Configurações Adicionais</h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowCustomPricing"
                      name="allowCustomPricing"
                      checked={formData.allowCustomPricing}
                      onCheckedChange={onCheckboxChange}
                    />
                    <Label htmlFor="allowCustomPricing">Permitir preços customizados</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultDiscount">Desconto padrão (%)</Label>
                    <Input
                      id="defaultDiscount"
                      name="defaultDiscount"
                      type="number"
                      step="0.01"
                      value={formData.defaultDiscount}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>

              {/* Metropolitan Cities Section */}
              <MetropolitanCitiesSection
                selectedCities={selectedCities}
                cities={cities}
                onCityToggle={onCityToggle}
                onCreateNewCity={onCreateNewCity}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPriceTable ? 'Atualizar' : 'Criar'} Tabela
                </Button>
              </div>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
