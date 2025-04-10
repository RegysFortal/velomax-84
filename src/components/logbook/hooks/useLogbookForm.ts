
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogbookEntry } from '@/types';
import { useLogbook } from '@/contexts/LogbookContext';
import { logbookFormSchema } from '../schema';

interface UseLogbookFormProps {
  initialData?: LogbookEntry;
  entryId?: string;
  onSuccess: () => void;
}

export function useLogbookForm({ initialData, entryId, onSuccess }: UseLogbookFormProps) {
  const { addLogbookEntry, updateLogbookEntry, getLogbookEntryById } = useLogbook();

  const form = useForm<z.infer<typeof logbookFormSchema>>({
    resolver: zodResolver(logbookFormSchema),
    defaultValues: {
      vehicleId: initialData?.vehicleId || "",
      driverId: initialData?.driverId || "",
      assistantId: initialData?.assistantId || "none",
      date: initialData?.date || new Date().toISOString().split('T')[0],
      departureTime: initialData?.departureTime || "",
      departureOdometer: initialData?.departureOdometer || 0,
      returnTime: initialData?.returnTime || "",
      endOdometer: initialData?.endOdometer || undefined,
      notes: initialData?.notes || "",
    },
  });

  useEffect(() => {
    if (entryId) {
      const entry = getLogbookEntryById(entryId);
      if (entry) {
        form.setValue("vehicleId", entry.vehicleId);
        form.setValue("driverId", entry.driverId);
        form.setValue("assistantId", entry.assistantId || "none");
        form.setValue("date", entry.date);
        form.setValue("departureTime", entry.departureTime);
        form.setValue("departureOdometer", entry.departureOdometer);
        form.setValue("returnTime", entry.returnTime || "");
        form.setValue("endOdometer", entry.endOdometer || undefined);
        form.setValue("notes", entry.notes || "");
      }
    }
  }, [entryId, getLogbookEntryById, form]);

  const onSubmit = (data: z.infer<typeof logbookFormSchema>) => {
    if (entryId) {
      updateLogbookEntry(entryId, {
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        assistantId: data.assistantId === "none" ? undefined : data.assistantId,
        departureTime: data.departureTime,
        departureOdometer: Number(data.departureOdometer),
        date: data.date,
        returnTime: data.returnTime === "" ? undefined : data.returnTime,
        endOdometer: data.endOdometer ? Number(data.endOdometer) : undefined,
        notes: data.notes,
        status: data.returnTime ? 'completed' : 'ongoing',
      });
    } else {
      addLogbookEntry({
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        assistantId: data.assistantId === "none" ? undefined : data.assistantId,
        departureTime: data.departureTime,
        departureOdometer: Number(data.departureOdometer),
        date: data.date,
        tripDistance: data.endOdometer && Number(data.endOdometer) > Number(data.departureOdometer) ? 
          Number(data.endOdometer) - Number(data.departureOdometer) : undefined,
        returnTime: data.returnTime === "" ? undefined : data.returnTime,
        endOdometer: data.endOdometer ? Number(data.endOdometer) : undefined,
        notes: data.notes,
        status: data.returnTime ? 'completed' : 'ongoing',
      });
    }
    onSuccess();
  };

  return {
    form,
    onSubmit,
  };
}
