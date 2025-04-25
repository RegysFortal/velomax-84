
import React from 'react';
import { ServiceRateRow } from './ServiceRateRow';

interface SpecialServicesSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SpecialServicesSection({ formData, onChange }: SpecialServicesSectionProps) {
  return (
    <div className="space-y-4">
      <ServiceRateRow
        label="Biológico Normal" 
        minRateField="minimumRate.normalBiological" 
        weightLimitField="weightLimits.normalBiological" 
        excessRateField="excessWeight.biologicalPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Biológico Infeccioso" 
        minRateField="minimumRate.infectiousBiological" 
        weightLimitField="weightLimits.infectiousBiological" 
        excessRateField="excessWeight.biologicalPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Veículo Rastreado" 
        minRateField="minimumRate.trackedVehicle" 
        weightLimitField="weightLimits.trackedVehicle" 
        excessRateField="excessWeight.maxPerKg"
        formData={formData}
        onChange={onChange}
        defaultWeight={100}
      />
      <ServiceRateRow
        label="Porta a Porta Interior" 
        minRateField="minimumRate.doorToDoorInterior" 
        weightLimitField="weightLimits.doorToDoorInterior" 
        excessRateField="excessWeight.maxPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Redespacho" 
        minRateField="minimumRate.reshipment" 
        weightLimitField="weightLimits.reshipment" 
        excessRateField="excessWeight.reshipmentPerKg"
        formData={formData}
        onChange={onChange}
      />
    </div>
  );
}
