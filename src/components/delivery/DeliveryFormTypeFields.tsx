
import React, { useEffect } from 'react';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import {
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { City, DeliveryType } from '@/types';

interface DeliveryFormTypeFieldsProps {
  control: Control<any>;
  watchDeliveryType: DeliveryType;
  watchCargoValue: number;
  showDoorToDoor: boolean;
  cities: City[];
  onCargoValueChange?: (value: number) => void;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
}

export function DeliveryFormTypeFields({
  control,
  watchDeliveryType,
  watchCargoValue,
  showDoorToDoor,
  cities,
  onCargoValueChange,
  setValue,
  getValues
}: DeliveryFormTypeFieldsProps) {

  const deliveryTypeOptions = [
    { value: 'standard', label: 'Padrão' },
    { value: 'emergency', label: 'Emergência' },
    { value: 'exclusive', label: 'Exclusivo' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sundayHoliday', label: 'Domingo/Feriado' },
    { value: 'difficultAccess', label: 'Acesso Difícil' },
    { value: 'metropolitanRegion', label: 'Região Metropolitana' },
    { value: 'doorToDoorInterior', label: 'Porta a Porta Interior' },
    { value: 'reshipment', label: 'Redespacho' },
    { value: 'normalBiological', label: 'Biológico Normal' },
    { value: 'infectiousBiological', label: 'Biológico Infeccioso' },
    { value: 'tracked', label: 'Rastreado' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="deliveryType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Entrega</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {deliveryTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isCourtesy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked && setValue) {
                      setValue('totalFreight', 0);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Entrega Cortesia
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Marque se esta entrega é cortesia (frete zerado)
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>

      {showDoorToDoor && (
        <FormField
          control={control}
          name="cityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade de Destino</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name} - {city.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {watchDeliveryType === 'reshipment' && (
        <FormField
          control={control}
          name="cargoValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Carga (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(e);
                    onCargoValueChange?.(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
