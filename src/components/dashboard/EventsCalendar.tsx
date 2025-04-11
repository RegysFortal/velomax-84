
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Event types with corresponding colors
const EVENT_TYPES = {
  'birthday': { label: 'Aniversário', color: 'bg-pink-500' },
  'delivery': { label: 'Entrega', color: 'bg-blue-500' },
  'holiday': { label: 'Feriado', color: 'bg-purple-500' },
  'meeting': { label: 'Reunião', color: 'bg-amber-500' },
  'other': { label: 'Outro', color: 'bg-gray-500' }
};

type EventType = keyof typeof EVENT_TYPES;

interface Event {
  id: string;
  date: Date;
  title: string;
  type: EventType;
  description?: string;
}

export function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([
    { id: '1', date: new Date(), title: 'Reunião com Cliente', type: 'meeting', description: 'Reunião com cliente ABC para discutir próximas entregas' },
    { id: '2', date: new Date(new Date().setDate(new Date().getDate() + 2)), title: 'Aniversário João', type: 'birthday', description: 'Aniversário do motorista João' },
    { id: '3', date: new Date(new Date().setDate(new Date().getDate() + 5)), title: 'Feriado Municipal', type: 'holiday' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    date: new Date(),
    type: 'other'
  });
  const { toast } = useToast();

  // Filter events for the selected date
  const eventsForSelectedDate = selectedDate 
    ? events.filter(event => 
        event.date.getDate() === selectedDate.getDate() && 
        event.date.getMonth() === selectedDate.getMonth() && 
        event.date.getFullYear() === selectedDate.getFullYear())
    : [];

  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Add a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      date: newEvent.date!,
      title: newEvent.title!,
      type: newEvent.type as EventType,
      description: newEvent.description
    };

    setEvents([...events, event]);
    setIsDialogOpen(false);
    setNewEvent({
      date: new Date(),
      type: 'other'
    });

    toast({
      title: "Evento adicionado",
      description: "O evento foi adicionado com sucesso"
    });
  };

  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calendário de Eventos</CardTitle>
            <CardDescription>Aniversários, Entregas, Feriados e mais</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="shrink-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Evento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-title">Título do Evento</Label>
                  <Input 
                    id="event-title" 
                    value={newEvent.title || ''} 
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Ex: Reunião com cliente" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-type">Tipo de Evento</Label>
                  <Select 
                    value={newEvent.type} 
                    onValueChange={(value: EventType) => setNewEvent({...newEvent, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVENT_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Data do Evento</Label>
                  <Calendar
                    mode="single"
                    selected={newEvent.date}
                    onSelect={(date) => setNewEvent({...newEvent, date})}
                    locale={ptBR}
                    className="rounded-md border mx-auto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-description">Descrição (opcional)</Label>
                  <Input 
                    id="event-description" 
                    value={newEvent.description || ''} 
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Descrição do evento" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddEvent}>Adicionar Evento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              locale={ptBR}
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
                today: "bg-secondary text-secondary-foreground"
              }}
              modifiers={{
                hasEvent: (date) => isDayWithEvent(date)
              }}
              modifiersStyles={{
                hasEvent: { 
                  fontWeight: 'bold', 
                  textDecoration: 'underline', 
                  color: 'var(--primary)' 
                }
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">
              {selectedDate ? (
                <span>
                  Eventos em {selectedDate.getDate()}/
                  {selectedDate.getMonth() + 1}/
                  {selectedDate.getFullYear()}
                </span>
              ) : 'Nenhuma data selecionada'}
            </h3>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map(event => (
                  <div key={event.id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge 
                        className={`${EVENT_TYPES[event.type].color} text-white`}
                      >
                        {EVENT_TYPES[event.type].label}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum evento encontrado para esta data.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          {Object.entries(EVENT_TYPES).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1 text-sm">
              <span className={`${value.color} w-3 h-3 rounded-full inline-block`}></span>
              <span>{value.label}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
