
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { City } from '@/types';

interface DeliveryFormTypeFieldsProps {
  control: Control<any>;
  watchDeliveryType: string;
  watchCargoValue: number;
  showDoorToDoor: boolean;
  cities: City[];
  onCargoValueChange: (value: number) => void;
}

export function DeliveryFormTypeFields({
  control,
  watchDeliveryType,
  watchCargoValue,
  showDoorToDoor,
  cities,
  onCargoValueChange
}: DeliveryFormTypeFieldsProps) {
  return (
    <>
      <FormField 
        control={control} 
        name="deliveryType" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Entrega</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o tipo de entrega" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-80 overflow-y-auto z-50 bg-background">
                <SelectItem value="standard">Normal</SelectItem>
                <SelectItem value="emergency">Emergencial</SelectItem>
                <SelectItem value="exclusive">Veículo Exclusivo</SelectItem>
                <SelectItem value="saturday">Sábado</SelectItem>
                <SelectItem value="sundayHoliday">Domingo/Feriado</SelectItem>
                <SelectItem value="difficultAccess">Difícil Acesso</SelectItem>
                <SelectItem value="metropolitanRegion">Região Metropolitana</SelectItem>
                <SelectItem value="doorToDoorInterior">Porta a Porta Interior</SelectItem>
                <SelectItem value="reshipment">Redespacho (1% seguro)</SelectItem>
                <SelectItem value="normalBiological">Biológico Normal</SelectItem>
                <SelectItem value="infectiousBiological">Biológico Infeccioso</SelectItem>
                <SelectItem value="tracked">Veículo Rastreado</SelectItem>
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
              <FormLabel>Valor da Nota Fiscal (R$)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                  className="bg-background"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                    onCargoValueChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium text-amber-600">
                  Para redespacho, o seguro é calculado como 1% do valor da carga
                </p>
                {watchCargoValue > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    Valor do seguro: R$ {(watchCargoValue * 0.01).toFixed(2)}
                  </p>
                )}
              </div>
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
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-80 z-50 bg-background">
                  {cities.map(city => (
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
