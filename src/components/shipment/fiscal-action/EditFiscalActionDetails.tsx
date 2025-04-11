
import React, { useState } from 'react';
import { FiscalAction } from '@/types/shipment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

interface EditFiscalActionDetailsProps {
  fiscalAction: FiscalAction;
  onSave: (updates: Partial<FiscalAction>) => void;
  onCancel: () => void;
}

export function EditFiscalActionDetails({ 
  fiscalAction, 
  onSave,
  onCancel
}: EditFiscalActionDetailsProps) {
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(
    fiscalAction.paymentDate ? new Date(fiscalAction.paymentDate) : undefined
  );
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(
    fiscalAction.releaseDate ? new Date(fiscalAction.releaseDate) : undefined
  );
  const [notes, setNotes] = useState(fiscalAction.notes || '');
  
  const handleSave = () => {
    const updates: Partial<FiscalAction> = {
      paymentDate: paymentDate ? format(paymentDate, 'yyyy-MM-dd') : undefined,
      releaseDate: releaseDate ? format(releaseDate, 'yyyy-MM-dd') : undefined,
      notes
    };
    
    onSave(updates);
  };
  
  return (
    <div className="border p-4 rounded-md bg-muted/50">
      <h3 className="text-lg font-semibold mb-4">Atualizar Ação Fiscal</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="actionNumber">Número da Ação</Label>
            <Input 
              id="actionNumber" 
              value={fiscalAction.actionNumber || ''} 
              disabled 
              className="mt-1" 
            />
          </div>
          <div>
            <Label htmlFor="amountToPay">Valor a Pagar</Label>
            <Input 
              id="amountToPay" 
              value={fiscalAction.amountToPay.toString()} 
              disabled 
              className="mt-1" 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="reason">Motivo</Label>
          <Input id="reason" value={fiscalAction.reason} disabled className="mt-1" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data de Pagamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !paymentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paymentDate ? format(paymentDate, "P", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={paymentDate}
                  onSelect={setPaymentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Data de Liberação</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !releaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {releaseDate ? format(releaseDate, "P", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={releaseDate}
                  onSelect={setReleaseDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Informações adicionais sobre a ação fiscal"
            className="mt-1"
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
