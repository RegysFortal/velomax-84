
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, FilePlus, Fuel } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LogbookEntryForm from './LogbookEntryForm';
import FuelRecordForm from './FuelRecordForm';
import { useToast } from '@/hooks/use-toast';

interface LogbookPageHeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isNewEntryOpen: boolean;
  setIsNewEntryOpen: (isOpen: boolean) => void;
  isNewFuelOpen: boolean;
  setIsNewFuelOpen: (isOpen: boolean) => void;
  isNewMaintenanceOpen: boolean;
  setIsNewMaintenanceOpen: (isOpen: boolean) => void;
}

export const LogbookPageHeader: React.FC<LogbookPageHeaderProps> = ({
  selectedDate,
  setSelectedDate,
  isNewEntryOpen,
  setIsNewEntryOpen,
  isNewFuelOpen,
  setIsNewFuelOpen,
  isNewMaintenanceOpen,
  setIsNewMaintenanceOpen
}) => {
  const { toast } = useToast();

  const handleNewEntrySuccess = () => {
    setIsNewEntryOpen(false);
    toast({
      title: "Registro criado",
      description: "Entrada do diário de bordo foi registrada com sucesso.",
    });
  };

  const handleNewFuelSuccess = () => {
    setIsNewFuelOpen(false);
    toast({
      title: "Abastecimento registrado",
      description: "O registro de abastecimento foi criado com sucesso.",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Diário de Bordo</h1>
        <p className="text-muted-foreground">
          Gerencie saídas e entradas de veículos, abastecimentos e manutenções.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <FilePlus className="h-4 w-4" />
              Novo registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar saída/entrada de veículo</DialogTitle>
              <DialogDescription>
                Preencha os dados da saída e, quando o veículo retornar, complete os dados de retorno.
              </DialogDescription>
            </DialogHeader>
            <LogbookEntryForm
              onSuccess={handleNewEntrySuccess}
              onCancel={() => setIsNewEntryOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isNewFuelOpen} onOpenChange={setIsNewFuelOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" variant="outline">
              <Fuel className="h-4 w-4" />
              Abastecimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar abastecimento</DialogTitle>
              <DialogDescription>
                Registre os detalhes do abastecimento de combustível.
              </DialogDescription>
            </DialogHeader>
            <FuelRecordForm
              onSuccess={handleNewFuelSuccess}
              onCancel={() => setIsNewFuelOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
