
import { z } from 'zod';

export const cityFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da cidade deve ter pelo menos 2 caracteres.",
  }),
  state: z.string().length(2, {
    message: "O estado deve ter 2 caracteres.",
  }),
  distance: z.coerce.number().min(0, {
    message: "A distância deve ser um número positivo.",
  }),
});
