
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
import { Edit, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  onDelete: (id: string) => void;
}

export function DeliveryDetails({ delivery, open, onClose, onEdit, onDelete }: DeliveryDetailsProps) {
  if (!delivery) return null;

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta entrega?')) {
      onDelete(delivery.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Detalhes da Entrega</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(delivery)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Minuta: {delivery.minuteNumber}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-130px)]">
          <div className="space-y-6 py-4 px-1">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
