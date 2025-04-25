
import React from 'react';
import { ServiceRateRow } from './ServiceRateRow';

interface StandardServicesSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StandardServicesSection({ formData, onChange }: StandardServicesSectionProps) {
  return (
    <div className="space-y-4">
      <ServiceRateRow
        label="Entrega Padrão" 
        minRateField="minimumRate.standardDelivery" 
        weightLimitField="weightLimits.standardDelivery" 
        excessRateField="excessWeight.minPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Coleta Emergencial" 
        minRateField="minimumRate.emergencyCollection" 
        weightLimitField="weightLimits.emergencyCollection" 
        excessRateField="excessWeight.maxPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Coleta Sábado" 
        minRateField="minimumRate.saturdayCollection" 
        weightLimitField="weightLimits.saturdayCollection" 
        excessRateField="excessWeight.maxPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Veículo Exclusivo" 
        minRateField="minimumRate.exclusiveVehicle" 
        weightLimitField="weightLimits.exclusiveVehicle" 
        excessRateField="excessWeight.maxPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Acesso Difícil Agendado" 
        minRateField="minimumRate.scheduledDifficultAccess" 
        weightLimitField="weightLimits.scheduledDifficultAccess" 
        excessRateField="excessWeight.maxPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Região Metropolitana" 
        minRateField="minimumRate.metropolitanRegion" 
        weightLimitField="weightLimits.metropolitanRegion" 
        excessRateField="excessWeight.maxPerKg"
        formData={formData}
        onChange={onChange}
      />
      <ServiceRateRow
        label="Domingo/Feriado" 
        minRateField="minimumRate.sundayHoliday" 
        weightLimitField="weightLimits.sundayHoliday" 
        excessRateField="excessWeight.maxPerKg"
        formData={formData}
        onChange={onChange}
      />
    </div>
  );
}
