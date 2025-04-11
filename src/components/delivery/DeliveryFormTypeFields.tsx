import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { City } from '@/types';

interface DeliveryFormTypeFieldsProps {
  control: Control<any>;
  watchDeliveryType: string;
  showDoorToDoor: boolean;
  cities: City[];
}

export function DeliveryFormTypeFields({ 
  control,
  watchDeliveryType,
  showDoorToDoor,
  cities
}: DeliveryFormTypeFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="deliveryType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Entrega</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de entrega" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-80">
                <SelectItem value="standard">Normal</SelectItem>
                <SelectItem value="emergency">Emergencial</SelectItem>
                <SelectItem value="exclusive">Veículo Exclusivo</SelectItem>
                <SelectItem value="saturday">Sábado</SelectItem>
                <SelectItem value="sundayHoliday">Domingo/Feriado</SelectItem>
                <SelectItem value="difficultAccess">Difícil Acesso</SelectItem>
                <SelectItem value="metropolitanRegion">Região Metropolitana</SelectItem>
                <SelectItem value="doorToDoorInterior">Porta a Porta Interior</SelectItem>
                <SelectItem value="reshipment">Redespacho</SelectItem>
                <SelectItem value="normalBiological">Biológico Normal</SelectItem>
                <SelectItem value="infectiousBiological">Biológico Infeccioso</SelectItem>
                <SelectItem value="tracked">Veículo Rastreado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="cargoType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Carga</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de carga" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="standard">Padrão</SelectItem>
                <SelectItem value="perishable">Perecível</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {watchDeliveryType === 'reshipment' && (
        <FormField
          control={control}
          name="cargoValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Carga (R$)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {showDoorToDoor && (
        <FormField
          control={control}
          name="cityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-80">
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name} - {city.distance}km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
