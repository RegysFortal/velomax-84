
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

  // Effect to handle cortesia option - zero out freight
  useEffect(() => {
    if (watchDeliveryType === 'cortesia' && setValue) {
      setValue('totalFreight', 0);
    }
  }, [watchDeliveryType, setValue]);

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
    { value: 'cortesia', label: 'Cortesia' }, // Nova opção adicionada
  ];

  return (
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

      {watchDeliveryType === 'cortesia' && (
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            💡 Entrega cortesia selecionada - o frete será zerado automaticamente.
          </p>
        </div>
      )}
    </div>
  );
}
