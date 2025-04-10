
import { z } from 'zod';

export const deliveryFormSchema = z.object({
  clientId: z.string({ required_error: 'Cliente é obrigatório' }),
  minuteNumber: z.string().optional(),
  deliveryDate: z.string({ required_error: 'Data de entrega é obrigatória' }),
  deliveryTime: z.string({ required_error: 'Hora de entrega é obrigatória' }),
  receiver: z.string({ required_error: 'Destinatário é obrigatório' }).min(3, 'Mínimo de 3 caracteres'),
  weight: z.string({ required_error: 'Peso é obrigatório' }).refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Peso deve ser maior que zero',
  }),
  packages: z.string({ required_error: 'Quantidade de volumes é obrigatória' }).refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'Volumes devem ser maior que zero',
  }),
  deliveryType: z.string({ required_error: 'Tipo de entrega é obrigatório' }),
  cargoType: z.string({ required_error: 'Tipo de carga é obrigatório' }),
  cargoValue: z.string().optional(),
  cityId: z.string().optional(),
  notes: z.string().optional(),
  occurrence: z.string().optional(),
  pickupName: z.string().optional(),
  pickupDate: z.string().optional(),
  pickupTime: z.string().optional(),
});
