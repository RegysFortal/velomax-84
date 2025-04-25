
import React from 'react';
import { StandardServicesSection } from './rate-sections/StandardServicesSection';
import { SpecialServicesSection } from './rate-sections/SpecialServicesSection';
import { DoorToDoorSection } from './rate-sections/DoorToDoorSection';
import { WaitingHourSection } from './rate-sections/WaitingHourSection';
import { InsuranceSection } from './rate-sections/InsuranceSection';

interface RatesFormSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RatesFormSection({ formData, onChange }: RatesFormSectionProps) {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Serviços e Taxas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure os valores de taxa mínima, peso mínimo e excedente para cada tipo de serviço.
        </p>

        {/* Serviços Padrão */}
        <StandardServicesSection formData={formData} onChange={onChange} />

        {/* Serviços Especiais */}
        <h3 className="text-xl font-semibold mb-4 mt-8">Serviços Especiais</h3>
        <SpecialServicesSection formData={formData} onChange={onChange} />

        {/* Configurações Adicionais */}
        <h3 className="text-xl font-semibold mb-4 mt-8">Configurações por KM</h3>
        <DoorToDoorSection formData={formData} onChange={onChange} />

        {/* Hora de Espera */}
        <h3 className="text-xl font-semibold mb-4 mt-8">Hora de Espera</h3>
        <WaitingHourSection formData={formData} onChange={onChange} />

        {/* Seguro */}
        <h3 className="text-xl font-semibold mb-4 mt-8">Seguro</h3>
        <InsuranceSection formData={formData} onChange={onChange} />
      </div>
    </>
  );
}
