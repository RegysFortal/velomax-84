
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RatesFormSectionProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RatesFormSection({ formData, onChange }: RatesFormSectionProps) {
  return (
    <>
      {/* Minimum Rate Section */}
      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-4 text-lg">Taxas Mínimas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minimumRate.standardDelivery">Entrega Padrão</Label>
            <Input
              type="number"
              id="minimumRate.standardDelivery"
              name="minimumRate.standardDelivery"
              value={formData.minimumRate.standardDelivery}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.emergencyCollection">Coleta Emergencial</Label>
            <Input
              type="number"
              id="minimumRate.emergencyCollection"
              name="minimumRate.emergencyCollection"
              value={formData.minimumRate.emergencyCollection}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.saturdayCollection">Coleta Sábado</Label>
            <Input
              type="number"
              id="minimumRate.saturdayCollection"
              name="minimumRate.saturdayCollection"
              value={formData.minimumRate.saturdayCollection}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.exclusiveVehicle">Veículo Exclusivo</Label>
            <Input
              type="number"
              id="minimumRate.exclusiveVehicle"
              name="minimumRate.exclusiveVehicle"
              value={formData.minimumRate.exclusiveVehicle}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.scheduledDifficultAccess">Acesso Difícil Agendado</Label>
            <Input
              type="number"
              id="minimumRate.scheduledDifficultAccess"
              name="minimumRate.scheduledDifficultAccess"
              value={formData.minimumRate.scheduledDifficultAccess}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.metropolitanRegion">Região Metropolitana</Label>
            <Input
              type="number"
              id="minimumRate.metropolitanRegion"
              name="minimumRate.metropolitanRegion"
              value={formData.minimumRate.metropolitanRegion}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.sundayHoliday">Domingo/Feriado</Label>
            <Input
              type="number"
              id="minimumRate.sundayHoliday"
              name="minimumRate.sundayHoliday"
              value={formData.minimumRate.sundayHoliday}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.normalBiological">Biológico Normal</Label>
            <Input
              type="number"
              id="minimumRate.normalBiological"
              name="minimumRate.normalBiological"
              value={formData.minimumRate.normalBiological}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.infectiousBiological">Biológico Infeccioso</Label>
            <Input
              type="number"
              id="minimumRate.infectiousBiological"
              name="minimumRate.infectiousBiological"
              value={formData.minimumRate.infectiousBiological}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.trackedVehicle">Veículo Rastreado</Label>
            <Input
              type="number"
              id="minimumRate.trackedVehicle"
              name="minimumRate.trackedVehicle"
              value={formData.minimumRate.trackedVehicle}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.doorToDoorInterior">Porta a Porta Interior</Label>
            <Input
              type="number"
              id="minimumRate.doorToDoorInterior"
              name="minimumRate.doorToDoorInterior"
              value={formData.minimumRate.doorToDoorInterior}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumRate.reshipment">Redespacho</Label>
            <Input
              type="number"
              id="minimumRate.reshipment"
              name="minimumRate.reshipment"
              value={formData.minimumRate.reshipment}
              onChange={onChange}
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Excess Weight Section */}
      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-4 text-lg">Excesso de Peso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="excessWeight.minPerKg">Taxa Mínima por Kg</Label>
            <Input
              type="number"
              id="excessWeight.minPerKg"
              name="excessWeight.minPerKg"
              value={formData.excessWeight.minPerKg}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excessWeight.maxPerKg">Taxa Máxima por Kg</Label>
            <Input
              type="number"
              id="excessWeight.maxPerKg"
              name="excessWeight.maxPerKg"
              value={formData.excessWeight.maxPerKg}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excessWeight.biologicalPerKg">Taxa Biológico por Kg</Label>
            <Input
              type="number"
              id="excessWeight.biologicalPerKg"
              name="excessWeight.biologicalPerKg"
              value={formData.excessWeight.biologicalPerKg}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excessWeight.reshipmentPerKg">Taxa Redespacho por Kg</Label>
            <Input
              type="number"
              id="excessWeight.reshipmentPerKg"
              name="excessWeight.reshipmentPerKg"
              value={formData.excessWeight.reshipmentPerKg}
              onChange={onChange}
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Door to Door Section */}
      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-4 text-lg">Porta a Porta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doorToDoor.ratePerKm">Taxa por Km</Label>
            <Input
              type="number"
              id="doorToDoor.ratePerKm"
              name="doorToDoor.ratePerKm"
              value={formData.doorToDoor.ratePerKm}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doorToDoor.maxWeight">Peso Máximo</Label>
            <Input
              type="number"
              id="doorToDoor.maxWeight"
              name="doorToDoor.maxWeight"
              value={formData.doorToDoor.maxWeight || 0}
              onChange={onChange}
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Waiting Hour Section */}
      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-4 text-lg">Hora de Espera</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="waitingHour.standard">Padrão</Label>
            <Input
              type="number"
              id="waitingHour.standard"
              name="waitingHour.standard"
              value={formData.waitingHour.standard}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waitingHour.exclusive">Exclusivo</Label>
            <Input
              type="number"
              id="waitingHour.exclusive"
              name="waitingHour.exclusive"
              value={formData.waitingHour.exclusive}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waitingHour.fiorino">Fiorino</Label>
            <Input
              type="number"
              id="waitingHour.fiorino"
              name="waitingHour.fiorino"
              value={formData.waitingHour.fiorino || 0}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waitingHour.medium">Médio</Label>
            <Input
              type="number"
              id="waitingHour.medium"
              name="waitingHour.medium"
              value={formData.waitingHour.medium || 0}
              onChange={onChange}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waitingHour.large">Grande</Label>
            <Input
              type="number"
              id="waitingHour.large"
              name="waitingHour.large"
              value={formData.waitingHour.large || 0}
              onChange={onChange}
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Insurance Section */}
      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-4 text-lg">Seguro</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insurance.rate">Taxa de Seguro</Label>
            <Input
              type="number"
              id="insurance.rate"
              name="insurance.rate"
              value={formData.insurance.rate}
              onChange={onChange}
              step="0.001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance.standard">Seguro Padrão</Label>
            <Input
              type="number"
              id="insurance.standard"
              name="insurance.standard"
              value={formData.insurance.standard || 0.01}
              onChange={onChange}
              step="0.001"
            />
          </div>
        </div>
      </div>
    </>
  );
}
