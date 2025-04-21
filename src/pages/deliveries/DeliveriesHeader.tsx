
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { DeliveryFormDialog } from '@/components/delivery/DeliveryFormDialog';

interface DeliveriesHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingDelivery: any | null;
  setEditingDelivery: (delivery: any | null) => void;
  onRefreshDeliveries: () => void;
  onDialogComplete: () => void;
}

export const DeliveriesHeader: React.FC<DeliveriesHeaderProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  editingDelivery,
  setEditingDelivery,
  onRefreshDeliveries,
  onDialogComplete
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Entregas</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefreshDeliveries}
          title="Atualizar lista de entregas"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
        <DeliveryFormDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          editingDelivery={editingDelivery}
          setEditingDelivery={setEditingDelivery}
          onComplete={onDialogComplete}
        />
      </div>
    </div>
  );
};
