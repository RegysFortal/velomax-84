
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { CalendarEvent } from '@/hooks/calendar/event-types';

interface EventDialogFooterProps {
  selectedEvent: CalendarEvent | undefined;
  handleDeleteEvent: () => void;
  handleSaveEvent: () => void;
  setShowEventDialog: (show: boolean) => void;
  resetForm: () => void;
}

export function EventDialogFooter({
  selectedEvent,
  handleDeleteEvent,
  handleSaveEvent,
  setShowEventDialog,
  resetForm
}: EventDialogFooterProps) {
  return (
    <DialogFooter className="flex justify-between pt-4">
      {selectedEvent && (
        <Button 
          variant="destructive" 
          onClick={handleDeleteEvent}
          type="button"
        >
          <Trash className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      )}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={() => {
            setShowEventDialog(false);
            resetForm();
          }}
        >
          Cancelar
        </Button>
        <Button onClick={handleSaveEvent}>
          {selectedEvent ? (
            <>
              <Edit className="h-4 w-4 mr-1" />
              Atualizar
            </>
          ) : 'Salvar'}
        </Button>
      </div>
    </DialogFooter>
  );
}
