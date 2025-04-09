
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VehicleTable } from './VehicleTable';
import { Vehicle } from '@/types';

interface VehicleListCardProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export const VehicleListCard: React.FC<VehicleListCardProps> = ({
  vehicles,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          Lista de Veículos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <VehicleTable 
          vehicles={vehicles} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </CardContent>
    </Card>
  );
};
