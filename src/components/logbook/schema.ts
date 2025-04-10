
import { z } from 'zod';

export const logbookFormSchema = z.object({
  vehicleId: z.string().min(1, {
    message: "Selecione um veículo.",
  }),
  driverId: z.string().min(1, {
    message: "Selecione um motorista.",
  }),
  assistantId: z.string().optional(),
  date: z.string().min(1, {
    message: "Selecione uma data.",
  }),
  departureTime: z.string().min(1, {
    message: "Informe a hora de saída.",
  }),
  departureOdometer: z.coerce.number().min(0, {
    message: "Informe a km de saída.",
  }),
  returnTime: z.string().optional(),
  endOdometer: z.coerce.number().optional(),
  notes: z.string().optional(),
});
