
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DeliveryFormDialog } from '@/components/delivery/DeliveryFormDialog';
import { Delivery } from '@/types';

interface DeliveriesHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingDelivery: Delivery | null;
  setEditingDelivery: React.Dispatch<React.SetStateAction<Delivery | null>>;
  onRefreshDeliveries: () => void;
  onDialogComplete: () => void;
  deliveries: Delivery[];
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
}

export function DeliveriesHeader({
  isDialogOpen,
  setIsDialogOpen,
  editingDelivery,
  setEditingDelivery,
  onRefreshDeliveries,
  onDialogComplete,
  deliveries,
  setDeliveries
}: DeliveriesHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Entregas</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas entregas nesta seção
        </p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onRefreshDeliveries}>
          Atualizar
        </Button>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Entrega
        </Button>
      </div>
      
      <DeliveryFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingDelivery(null);
        }}
        editingDelivery={editingDelivery}
        setEditingDelivery={setEditingDelivery}
        onComplete={onDialogComplete}
        deliveries={deliveries}
        setDeliveries={setDeliveries}
      />
    </div>
  );
}
