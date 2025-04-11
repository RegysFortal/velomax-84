
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FuelRecord } from '@/types';
import { useLogbook } from '@/contexts/LogbookContext';

const formSchema = z.object({
  vehicleId: z.string().min(1, {
    message: "Selecione um veículo.",
  }),
  date: z.string().min(1, {
    message: "Selecione uma data.",
  }),
  odometer: z.coerce.number().min(0, {
    message: "O hodômetro deve ser um número positivo.",
  }),
  liters: z.coerce.number().min(0, {
    message: "O número de litros deve ser um número positivo.",
  }),
  pricePerLiter: z.coerce.number().min(0, {
    message: "O preço por litro deve ser um número positivo.",
  }),
  totalCost: z.coerce.number().min(0, {
    message: "O custo total deve ser um número positivo.",
  }),
  fuelType: z.enum(['gasoline', 'diesel', 'ethanol', 'other'], {
    required_error: "Selecione um tipo de combustível.",
  }),
  isFull: z.boolean().default(true),
  station: z.string().min(2, {
    message: "O nome do posto deve ter pelo menos 2 caracteres.",
  }),
  notes: z.string().optional(),
});

export type FuelFormValues = z.infer<typeof formSchema>;

export const useFuelRecordForm = (
  initialData: FuelRecord | undefined,
  recordId: string | undefined,
  onSuccess: () => void
) => {
  const { 
    vehicles, 
    addFuelRecord, 
    updateFuelRecord, 
    getFuelRecordById 
  } = useLogbook();

  const form = useForm<FuelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: initialData?.vehicleId || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      odometer: initialData?.odometer || 0,
      liters: initialData?.liters || 0,
      pricePerLiter: initialData?.pricePerLiter || 0,
      totalCost: initialData?.totalCost || 0,
      fuelType: (initialData?.fuelType as 'gasoline' | 'diesel' | 'ethanol' | 'other') || 'gasoline',
      isFull: initialData?.isFull || true,
      station: initialData?.station || '',
      notes: initialData?.notes || '',
    },
  });

  useEffect(() => {
    if (recordId) {
      const record = getFuelRecordById(recordId);
      if (record) {
        form.setValue("vehicleId", record.vehicleId);
        form.setValue("date", record.date);
        form.setValue("odometer", record.odometer);
        form.setValue("liters", record.liters);
        form.setValue("pricePerLiter", record.pricePerLiter);
        form.setValue("totalCost", record.totalCost);
        form.setValue("fuelType", record.fuelType as 'gasoline' | 'diesel' | 'ethanol' | 'other');
        form.setValue("isFull", record.isFull);
        form.setValue("station", record.station);
        form.setValue("notes", record.notes || "");
      }
    }
  }, [recordId, getFuelRecordById, form]);

  const onSubmit = (data: FuelFormValues) => {
    const fuelData = {
      vehicleId: data.vehicleId,
      date: data.date,
      odometer: Number(data.odometer),
      liters: Number(data.liters),
      pricePerLiter: Number(data.pricePerLiter),
      totalCost: Number(data.totalCost),
      fuelType: data.fuelType,
      isFull: data.isFull,
      station: data.station,
      notes: data.notes,
    };

    if (recordId) {
      updateFuelRecord(recordId, fuelData);
    } else {
      addFuelRecord(fuelData);
    }
    onSuccess();
    form.reset();
  };

  return {
    form,
    onSubmit,
    vehicles
  };
};
