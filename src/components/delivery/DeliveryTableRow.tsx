
import React from 'react';
import { Delivery } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { formatToReadableDate } from '@/utils/dateUtils';

interface DeliveryTableRowProps {
  delivery: Delivery;
  clientName: string;
  onEdit: (delivery: Delivery) => void;
  onDelete: (id: string) => void;
  onViewDetails: (delivery: Delivery) => void;
}

export function DeliveryTableRow({ 
  delivery, 
  clientName, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: DeliveryTableRowProps) {
  
  return (
    <TableRow 
      key={delivery.id}
      className="cursor-pointer hover:bg-muted"
      onClick={() => onViewDetails(delivery)}
    >
      <TableCell className="px-2 py-2">{delivery.minuteNumber}</TableCell>
      <TableCell className="px-2 py-2">{clientName}</TableCell>
      <TableCell className="px-2 py-2">{formatToReadableDate(delivery.deliveryDate)}</TableCell>
      <TableCell className="px-2 py-2">{delivery.deliveryTime}</TableCell>
      <TableCell className="px-2 py-2">{delivery.receiver}</TableCell>
      <TableCell className="px-2 py-2">{delivery.weight} kg</TableCell>
      <TableCell className="px-2 py-2">{delivery.packages}</TableCell>
      <TableCell className="px-2 py-2">
        <Badge variant={delivery.deliveryType === 'emergency' ? 'destructive' : 'default'}>
          {delivery.deliveryType === 'standard' && 'Padrão'}
          {delivery.deliveryType === 'emergency' && 'Emergência'}
          {delivery.deliveryType === 'exclusive' && 'Exclusivo'}
          {delivery.deliveryType === 'saturday' && 'Sábado'}
          {delivery.deliveryType === 'sundayHoliday' && 'Domingo/Feriado'}
          {delivery.deliveryType === 'difficultAccess' && 'Acesso Difícil'}
          {delivery.deliveryType === 'metropolitanRegion' && 'Região Metropolitana'}
          {delivery.deliveryType === 'doorToDoorInterior' && 'Interior'}
          {delivery.deliveryType === 'reshipment' && 'Redespacho'}
          {delivery.deliveryType === 'normalBiological' && 'Biológico Normal'}
          {delivery.deliveryType === 'infectiousBiological' && 'Biológico Infeccioso'}
          {delivery.deliveryType === 'tracked' && 'Rastreado'}
        </Badge>
      </TableCell>
      <TableCell className="px-2 py-2">R$ {delivery.totalFreight.toFixed(2)}</TableCell>
      <TableCell className="px-2 py-2">
        {delivery.occurrence ? (
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            <span className="truncate max-w-[100px]" title={delivery.occurrence}>
              {delivery.occurrence}
            </span>
          </div>
        ) : '-'}
      </TableCell>
    </TableRow>
  );
}
