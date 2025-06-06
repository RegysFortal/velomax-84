
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shipment } from '@/types';

interface DeliveryFieldsProps {
  isScheduledDelivery: boolean;
  setIsScheduledDelivery: (isScheduled: boolean) => void;
  scheduledShipmentId: string;
  setScheduledShipmentId: (id: string) => void;
  shipments: Shipment[];
}

export function DeliveryFields({
  isScheduledDelivery,
  setIsScheduledDelivery,
  scheduledShipmentId,
  setScheduledShipmentId,
  shipments
}: DeliveryFieldsProps) {
  return (
    <>
      {/* Checkbox para entrega agendada - mantido para compatibilidade */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isScheduledDelivery"
          checked={isScheduledDelivery}
          onCheckedChange={setIsScheduledDelivery}
        />
        <Label htmlFor="isScheduledDelivery" className="text-sm font-normal">
          É uma entrega agendada
        </Label>
      </div>
      
      {isScheduledDelivery && shipments.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="shipment">Embarque</Label>
          <Select 
            value={scheduledShipmentId} 
            onValueChange={setScheduledShipmentId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o embarque" />
            </SelectTrigger>
            <SelectContent>
              {shipments.map((shipment) => (
                <SelectItem key={shipment.id} value={shipment.id}>
                  {shipment.trackingNumber} - {shipment.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
