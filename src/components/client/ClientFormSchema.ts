
import { z } from 'zod';

export const clientFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  tradingName: z.string().min(2, {
    message: "O nome fantasia deve ter pelo menos 2 caracteres.",
  }),
  document: z.string().optional(),
  address: z.string().optional(),
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  contact: z.string(),
  phone: z.string(),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  priceTableId: z.string(),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
