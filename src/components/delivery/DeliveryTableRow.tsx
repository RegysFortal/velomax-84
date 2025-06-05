
import React from 'react';
import { Delivery } from '@/types';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';

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
  // Check if delivery is incomplete (missing delivery type or total freight)
  const isIncomplete = delivery.deliveryType === 'standard' && delivery.totalFreight === 0;
  
  // Format delivery type display
  const getDeliveryTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      'standard': 'Padrão',
      'emergency': 'Emergencial',
      'exclusive': 'Exclusivo',
      'saturday': 'Sábado',
      'sundayHoliday': 'Domingo/Feriado',
      'difficultAccess': 'Difícil Acesso',
      'metropolitanRegion': 'Região Metropolitana',
      'doorToDoorInterior': 'Porta a Porta Interior',
      'reshipment': 'Redespache',
      'normalBiological': 'Biológico Normal',
      'infectiousBiological': 'Biológico Infeccioso',
      'tracked': 'Rastreado',
      'door_to_door': 'Porta a Porta',
      'scheduled': 'Agendado'
    };
    return typeMap[type] || type;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <TableRow className={isIncomplete ? 'bg-red-50 border-red-200' : ''}>
      <TableCell className="font-medium">
        <span className={isIncomplete ? 'text-red-800' : ''}>{delivery.minuteNumber}</span>
        {isIncomplete && (
          <Badge variant="destructive" className="ml-2 text-xs">
            Incompleta
          </Badge>
        )}
      </TableCell>
      <TableCell className={isIncomplete ? 'text-red-700' : ''}>{clientName}</TableCell>
      <TableCell className={isIncomplete ? 'text-red-700' : ''}>{formatDate(delivery.deliveryDate)}</TableCell>
      <TableCell className={isIncomplete ? 'text-red-700' : ''}>{delivery.deliveryTime}</TableCell>
      <TableCell className={isIncomplete ? 'text-red-700' : ''}>{delivery.receiver}</TableCell>
      <TableCell className={isIncomplete ? 'text-red-700' : ''}>{delivery.packages}</TableCell>
      <TableCell className={isIncomplete ? 'text-red-700' : ''}>{delivery.weight} kg</TableCell>
      <TableCell className={isIncomplete ? 'text-red-700' : ''}>
        <Badge variant={isIncomplete ? "destructive" : "secondary"}>
          {getDeliveryTypeDisplay(delivery.deliveryType)}
        </Badge>
      </TableCell>
      <TableCell className={isIncomplete ? 'text-red-700 font-medium' : ''}>
        {formatCurrency(delivery.totalFreight)}
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(delivery)}
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(delivery)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(delivery.id)}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
