
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RatesFormSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RatesFormSection({ formData, onChange }: RatesFormSectionProps) {
  // Função auxiliar para renderizar cada serviço com taxa mínima, peso mínimo e excedente
  const renderServiceRateRow = (
    label: string,
    minRateField: string,
    weightLimitField: string,
    excessRateField: string,
    defaultWeight: number = 10
  ) => {
    // Extract service name from minRateField (e.g., "minimumRate.standardDelivery" -> "standardDelivery")
    const serviceName = minRateField.split('.')[1];
    
    // Get weight limit value from formData.weightLimits if it exists
    const weightLimitValue = formData.weightLimits && formData.weightLimits[serviceName] 
      ? formData.weightLimits[serviceName]
      : defaultWeight;

    return (
      <div className="border p-4 rounded-md mb-4">
        <h4 className="font-medium mb-3 text-base">{label}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={minRateField}>Taxa Mínima (R$)</Label>
            <Input
              type="number"
              id={minRateField}
              name={minRateField}
              value={getValue(formData, minRateField)}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={weightLimitField}>Peso Mínimo (kg)</Label>
            <Input
              type="number"
              id={weightLimitField}
              name={weightLimitField}
              value={weightLimitValue}
              onChange={onChange}
              min="0"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={excessRateField}>Excedente (R$/kg)</Label>
            <Input
              type="number"
              id={excessRateField}
              name={excessRateField}
              value={getValue(formData, excessRateField)}
              onChange={onChange}
              step="0.01"
            />
          </div>
        </div>
      </div>
    );
  };

  // Função para obter valores aninhados usando string path notation
  const getValue = (obj: any, path: string) => {
    const keys = path.split('.');
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj);
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Serviços e Taxas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure os valores de taxa mínima, peso mínimo e excedente para cada tipo de serviço.
        </p>

        {/* Serviços Padrão */}
        <div className="space-y-4">
          {renderServiceRateRow(
            "Entrega Padrão", 
            "minimumRate.standardDelivery", 
            "weightLimits.standardDelivery", 
            "excessWeight.minPerKg"
          )}
          {renderServiceRateRow(
            "Coleta Emergencial", 
            "minimumRate.emergencyCollection", 
            "weightLimits.emergencyCollection", 
            "excessWeight.maxPerKg"
          )}
          {renderServiceRateRow(
            "Coleta Sábado", 
            "minimumRate.saturdayCollection", 
            "weightLimits.saturdayCollection", 
            "excessWeight.maxPerKg"
          )}
          {renderServiceRateRow(
            "Veículo Exclusivo", 
            "minimumRate.exclusiveVehicle", 
            "weightLimits.exclusiveVehicle", 
            "excessWeight.maxPerKg"
          )}
          {renderServiceRateRow(
            "Acesso Difícil Agendado", 
            "minimumRate.scheduledDifficultAccess", 
            "weightLimits.scheduledDifficultAccess", 
            "excessWeight.maxPerKg"
          )}
          {renderServiceRateRow(
            "Região Metropolitana", 
            "minimumRate.metropolitanRegion", 
            "weightLimits.metropolitanRegion", 
            "excessWeight.maxPerKg"
          )}
          {renderServiceRateRow(
            "Domingo/Feriado", 
            "minimumRate.sundayHoliday", 
            "weightLimits.sundayHoliday", 
            "excessWeight.maxPerKg"
          )}
        </div>

        {/* Serviços Especiais */}
        <h3 className="text-xl font-semibold mb-4 mt-8">Serviços Especiais</h3>
        <div className="space-y-4">
          {renderServiceRateRow(
            "Biológico Normal", 
            "minimumRate.normalBiological", 
            "weightLimits.normalBiological", 
            "excessWeight.biologicalPerKg"
          )}
          {renderServiceRateRow(
            "Biológico Infeccioso", 
            "minimumRate.infectiousBiological", 
            "weightLimits.infectiousBiological", 
            "excessWeight.biologicalPerKg"
          )}
          {renderServiceRateRow(
            "Veículo Rastreado", 
            "minimumRate.trackedVehicle", 
            "weightLimits.trackedVehicle", 
            "excessWeight.maxPerKg",
            100
          )}
          {renderServiceRateRow(
            "Porta a Porta Interior", 
            "minimumRate.doorToDoorInterior", 
            "weightLimits.doorToDoorInterior", 
            "excessWeight.maxPerKg"
          )}
          {renderServiceRateRow(
            "Redespacho", 
            "minimumRate.reshipment", 
            "weightLimits.reshipment", 
            "excessWeight.reshipmentPerKg"
          )}
        </div>

        {/* Configurações Adicionais */}
        <h3 className="text-xl font-semibold mb-4 mt-8">Configurações por KM</h3>
        <div className="border p-4 rounded-md">
          <h4 className="font-medium mb-3 text-base">Porta a Porta</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doorToDoor.ratePerKm">Taxa por Km (R$)</Label>
              <Input
                type="number"
                id="doorToDoor.ratePerKm"
                name="doorToDoor.ratePerKm"
                value={getValue(formData, "doorToDoor.ratePerKm") || 0}
                onChange={onChange}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doorToDoor.maxWeight">Peso Máximo (kg)</Label>
              <Input
                type="number"
                id="doorToDoor.maxWeight"
                name="doorToDoor.maxWeight"
                value={getValue(formData, "doorToDoor.maxWeight") || 0}
                onChange={onChange}
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Hora de Espera */}
        <h3 className="text-xl font-semibold mb-4 mt-8">Hora de Espera</h3>
        <div className="border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="waitingHour.standard">Padrão (R$/hora)</Label>
              <Input
                type="number"
                id="waitingHour.standard"
                name="waitingHour.standard"
                value={getValue(formData, "waitingHour.standard") || 0}
                onChange={onChange}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitingHour.exclusive">Exclusivo (R$/hora)</Label>
              <Input
                type="number"
                id="waitingHour.exclusive"
                name="waitingHour.exclusive"
                value={getValue(formData, "waitingHour.exclusive") || 0}
                onChange={onChange}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitingHour.fiorino">Fiorino (R$/hora)</Label>
              <Input
                type="number"
                id="waitingHour.fiorino"
                name="waitingHour.fiorino"
                value={getValue(formData, "waitingHour.fiorino") || 0}
                onChange={onChange}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitingHour.medium">Médio (R$/hora)</Label>
              <Input
                type="number"
                id="waitingHour.medium"
                name="waitingHour.medium"
                value={getValue(formData, "waitingHour.medium") || 0}
                onChange={onChange}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitingHour.large">Grande (R$/hora)</Label>
              <Input
                type="number"
                id="waitingHour.large"
                name="waitingHour.large"
                value={getValue(formData, "waitingHour.large") || 0}
                onChange={onChange}
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Seguro */}
        <h3 className="text-xl font-semibold mb-4 mt-8">Seguro</h3>
        <div className="border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insurance.rate">Taxa de Seguro (%)</Label>
              <Input
                type="number"
                id="insurance.rate"
                name="insurance.rate"
                value={getValue(formData, "insurance.rate") || 0.01}
                onChange={onChange}
                step="0.001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance.standard">Seguro Padrão (%)</Label>
              <Input
                type="number"
                id="insurance.standard"
                name="insurance.standard"
                value={getValue(formData, "insurance.standard") || 0.01}
                onChange={onChange}
                step="0.001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance.perishable">Seguro para Perecíveis (%)</Label>
              <Input
                type="number"
                id="insurance.perishable"
                name="insurance.perishable"
                value={getValue(formData, "insurance.perishable") || 0.01}
                onChange={onChange}
                step="0.001"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
