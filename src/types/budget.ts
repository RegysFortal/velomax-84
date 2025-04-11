
import { z } from "zod";

// Schema for package measurements
export const packageMeasurementSchema = z.object({
  id: z.string().optional(),
  width: z.number().min(0, "Largura deve ser maior que 0"),
  length: z.number().min(0, "Comprimento deve ser maior que 0"),
  height: z.number().min(0, "Altura deve ser maior que 0"),
  weight: z.number().min(0, "Peso deve ser maior que 0"),
  quantity: z.number().int().min(1, "Quantidade deve ser pelo menos 1").default(1),
});

// Define the allowed delivery types
export const DeliveryTypes = {
  standard: "standard",
  emergency: "emergency",
  exclusive: "exclusive",
  metropolitanRegion: "metropolitanRegion",
  doorToDoorInterior: "doorToDoorInterior",
  saturday: "saturday",
  sundayHoliday: "sundayHoliday",
  difficultAccess: "difficultAccess",
  reshipment: "reshipment",
  normalBiological: "normalBiological",
  infectiousBiological: "infectiousBiological",
  tracked: "tracked",
} as const;

export type DeliveryType = keyof typeof DeliveryTypes;

// Schema for budget
export const budgetSchema = z.object({
  id: z.string().optional(),
  clientId: z.string({
    required_error: "O cliente é obrigatório",
  }),
  totalVolumes: z.number().int().min(1, "Deve haver pelo menos 1 volume"),
  deliveryType: z.enum([
    "standard", 
    "emergency", 
    "exclusive", 
    "metropolitanRegion", 
    "doorToDoorInterior",
    "saturday",
    "sundayHoliday",
    "difficultAccess",
    "reshipment",
    "normalBiological",
    "infectiousBiological",
    "tracked"
  ], {
    required_error: "O tipo de entrega é obrigatório",
  }),
  merchandiseValue: z.number().min(0, "O valor da mercadoria não pode ser negativo").nullable().optional(),
  hasCollection: z.boolean().default(false),
  collectionLocation: z.string().optional(),
  hasDelivery: z.boolean().default(true),
  additionalServices: z.array(z.object({
    id: z.string().optional(),
    description: z.string(),
    value: z.number().min(0)
  })).default([]),
  packages: z.array(packageMeasurementSchema).min(1, "Pelo menos um volume deve ser especificado"),
  totalValue: z.number().min(0),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PackageMeasurement = z.infer<typeof packageMeasurementSchema>;
export type Budget = z.infer<typeof budgetSchema>;

// Utility to calculate cubic weight (peso cubado)
export const calculateCubicWeight = (width: number, length: number, height: number): number => {
  return (width * length * height) / 6000;
};

// Utility to determine if a package should use real or cubic weight
export const getEffectiveWeight = (realWeight: number, cubicWeight: number): number => {
  return Math.max(realWeight, cubicWeight);
};
