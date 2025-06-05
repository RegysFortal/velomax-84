
import React from 'react';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { City, DeliveryType } from '@/types';
import { DeliveryTypeSection } from './form-sections/DeliveryTypeSection';
import { PricingOptionsSection } from './form-sections/PricingOptionsSection';
import { CitySelectionSection } from './form-sections/CitySelectionSection';
import { CargoValueSection } from './form-sections/CargoValueSection';

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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeliveryTypeSection control={control} />
      </div>

      <PricingOptionsSection control={control} setValue={setValue} />

      <CitySelectionSection 
        control={control} 
        cities={cities} 
        showDoorToDoor={showDoorToDoor} 
      />

      <CargoValueSection 
        control={control}
        watchDeliveryType={watchDeliveryType}
        onCargoValueChange={onCargoValueChange}
      />
    </div>
  );
}
