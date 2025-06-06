
import { z } from 'zod';

export const deliveryFormSchema = z.object({
  minuteNumber: z.string().optional(),
  clientId: z.string().min(1, "Cliente é obrigatório"),
  deliveryDate: z.string().min(1, "Data de entrega é obrigatória"),
  deliveryTime: z.string().optional().nullable().transform(val => val || ''), // Hora é realmente opcional
  receiver: z.string().min(1, "Destinatário é obrigatório"),
  receiverId: z.string().optional(),
  weight: z.union([
    z.number().min(0.1, "Peso deve ser maior que 0"),
    z.string().refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.1;
    }, "Peso deve ser maior que 0")
  ]).transform(val => typeof val === 'string' ? parseFloat(val) : val),
  packages: z.union([
    z.number().int().min(1, "Quantidade de volumes deve ser maior que 0"),
    z.string().refine(val => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 1;
    }, "Quantidade de volumes deve ser maior que 0")
  ]).transform(val => typeof val === 'string' ? parseInt(val) : val),
  deliveryType: z.string().min(1, "Tipo de entrega é obrigatório"),
  cargoType: z.string().min(1, "Tipo de carga é obrigatório"),
  cargoValue: z.union([
    z.number().min(0, "Valor da carga deve ser maior ou igual a 0"),
    z.string().transform(val => {
      if (val === '' || val === undefined || val === null) return 0;
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    })
  ]).optional().default(0),
  totalFreight: z.number().min(0, "Valor do frete deve ser maior ou igual a 0"),
  notes: z.string().optional(),
  occurrence: z.string().optional(),
  cityId: z.string().optional(),
  arrivalKnowledgeNumber: z.string().optional(),
  isCourtesy: z.boolean().optional(),
  hasCustomPrice: z.boolean().optional()
});

export type DeliveryFormData = z.infer<typeof deliveryFormSchema>;
