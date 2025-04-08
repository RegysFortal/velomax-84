
import React from 'react';
import { Delivery } from '@/types';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle } from 'lucide-react';

interface NotesAndOccurrenceProps {
  delivery: Delivery;
}

export function NotesAndOccurrence({ delivery }: NotesAndOccurrenceProps) {
  return (
    <>
      {delivery.occurrence && (
        <>
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Ocorrência
            </h3>
            <p className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              {delivery.occurrence}
            </p>
          </div>
        </>
      )}

      {delivery.notes && (
        <>
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">Observações</h3>
            <p className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
              {delivery.notes}
            </p>
          </div>
        </>
      )}
    </>
  );
}
