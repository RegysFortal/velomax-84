
import React from 'react';
import { Delivery } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ClientInfo } from './details/ClientInfo';
import { PickupInfo } from './details/PickupInfo';
import { DeliveryInfo } from './details/DeliveryInfo';
import { CargoDetails } from './details/CargoDetails';
import { NotesAndOccurrence } from './details/NotesAndOccurrence';

interface DeliveryDetailsProps {
  delivery: Delivery | null;
  open: boolean;
  onClose: () => void;
  onEdit: (delivery: Delivery) => void;
}

export function DeliveryDetails({ delivery, open, onClose, onEdit }: DeliveryDetailsProps) {
  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Detalhes da Entrega</span>
            <Button variant="outline" size="sm" onClick={() => onEdit(delivery)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </DialogTitle>
          <DialogDescription>
            Minuta: {delivery.minuteNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <ClientInfo delivery={delivery} />

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <DeliveryInfo delivery={delivery} />
            <PickupInfo delivery={delivery} />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Detalhes da Carga</h3>
            <CargoDetails delivery={delivery} />
          </div>

          <NotesAndOccurrence delivery={delivery} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
