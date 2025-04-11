
import { z } from "zod";
import { budgetSchema } from "@/types/budget";

// Type for the form values
export type BudgetFormValues = z.infer<typeof budgetSchema>;

// Initial form values
export const getInitialFormValues = (initialData?: BudgetFormValues): BudgetFormValues => {
  return initialData || {
    clientId: '',
    totalVolumes: 1,
    deliveryType: 'standard',
    merchandiseValue: undefined,
    hasCollection: false,
    hasDelivery: true,
    additionalServices: [],
    packages: [{ width: 0, length: 0, height: 0, weight: 0, quantity: 1 }],
    totalValue: 0,
    notes: '',
  };
};
