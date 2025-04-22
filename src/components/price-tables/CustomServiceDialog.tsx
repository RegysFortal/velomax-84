
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CustomService } from '@/types';

interface CustomServiceFormData {
  id: string;
  name: string;
  minWeight: number;
  baseRate: number;
  excessRate: number;
  additionalInfo: string;
}

interface CustomServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentService: CustomService | null;
  formData: CustomServiceFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
}

export function CustomServiceDialog({
  open,
  onOpenChange,
  currentService,
  formData,
  onChange,
  onSave,
}: CustomServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {currentService ? 'Editar Serviço Personalizado' : 'Adicionar Serviço Personalizado'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Serviço</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Ex: Transporte de Frágeis"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minWeight">Peso Mínimo (kg)</Label>
              <Input
                id="minWeight"
                name="minWeight"
                type="number"
                step="0.1"
                value={formData.minWeight}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseRate">Taxa Base (R$)</Label>
              <Input
                id="baseRate"
                name="baseRate"
                type="number"
                step="0.01"
                value={formData.baseRate}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excessRate">Taxa Excedente (R$/kg)</Label>
            <Input
              id="excessRate"
              name="excessRate"
              type="number"
              step="0.01"
              value={formData.excessRate}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Informações Adicionais</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={onChange}
              placeholder="Informações adicionais sobre este serviço..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={onSave}>
            {currentService ? 'Atualizar' : 'Adicionar'} Serviço
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
