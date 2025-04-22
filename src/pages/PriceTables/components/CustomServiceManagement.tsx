
import React from 'react';
import { CustomServiceDialog } from '@/components/price-tables/CustomServiceDialog';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  customServices: any[];
  openCustomServiceDialog: (service?: any) => void;
  deleteCustomService: (id: string) => void;
}

export function CustomServiceManagement({
  customServices,
  openCustomServiceDialog,
  deleteCustomService,
}: Props) {
  return (
    <div className="border p-4 rounded-md mt-4">
      <h3 className="font-medium mb-4 text-lg">Serviços Personalizados</h3>
      <Button
        variant="secondary"
        type="button"
        className="mb-2"
        onClick={() => openCustomServiceDialog()}
      >
        <Plus className="h-4 w-4 mr-1" />
        Adicionar Serviço
      </Button>
      {customServices && customServices.length > 0 ? (
        <div className="space-y-2">
          {customServices.map((service) => (
            <div
              key={service.id}
              className="flex gap-2 items-center border p-2 rounded"
            >
              <span className="flex-1 text-sm font-medium">{service.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCustomServiceDialog(service)}
                type="button"
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteCustomService(service.id)}
                type="button"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm italic">
          Nenhum serviço personalizado cadastrado.
        </div>
      )}
    </div>
  );
}
