
import React from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { PriceTableFormData } from '@/types/priceTable';

const priceTableSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  multiplier: z.number().min(0, "Multiplicador deve ser maior que zero"),
  // Fortaleza Normal
  fortalezaNormalMinRate: z.number().min(0),
  fortalezaNormalExcessRate: z.number().min(0),
  // Fortaleza Emergencial
  fortalezaEmergencyMinRate: z.number().min(0),
  fortalezaEmergencyExcessRate: z.number().min(0),
  // Fortaleza Sábados
  fortalezaSaturdayMinRate: z.number().min(0),
  fortalezaSaturdayExcessRate: z.number().min(0),
  // Fortaleza Exclusivo
  fortalezaExclusiveMinRate: z.number().min(0),
  fortalezaExclusiveExcessRate: z.number().min(0),
  // Fortaleza Agendado/Difícil Acesso
  fortalezaScheduledMinRate: z.number().min(0),
  fortalezaScheduledExcessRate: z.number().min(0),
  // Região Metropolitana
  metropolitanMinRate: z.number().min(0),
  metropolitanExcessRate: z.number().min(0),
  // Fortaleza Domingos/Feriados
  fortalezaHolidayMinRate: z.number().min(0),
  fortalezaHolidayExcessRate: z.number().min(0),
  // Material Biológico Normal
  biologicalNormalMinRate: z.number().min(0),
  biologicalNormalExcessRate: z.number().min(0),
  // Material Biológico Infeccioso
  biologicalInfectiousMinRate: z.number().min(0),
  biologicalInfectiousExcessRate: z.number().min(0),
  // Veículo Rastreado
  trackedVehicleMinRate: z.number().min(0),
  trackedVehicleExcessRate: z.number().min(0),
  // Redespacho
  reshipmentMinRate: z.number().min(0),
  reshipmentExcessRate: z.number().min(0),
  reshipmentInvoicePercentage: z.number().min(0),
  // Exclusivo Interior
  interiorExclusiveMinRate: z.number().min(0),
  interiorExclusiveExcessRate: z.number().min(0),
  interiorExclusiveKmRate: z.number().min(0),
  // Additional properties
  allowCustomPricing: z.boolean().optional().default(false),
  defaultDiscount: z.number().min(0).optional().default(0),
});

type FormData = z.infer<typeof priceTableSchema>;

export function PriceTableForm({ onSubmit, initialData }: { onSubmit: (data: FormData) => void, initialData?: Partial<FormData> }) {
  const form = useForm<FormData>({
    resolver: zodResolver(priceTableSchema),
    defaultValues: {
      name: '',
      description: '',
      multiplier: 1,
      allowCustomPricing: false,
      defaultDiscount: 0,
      ...initialData
    }
  });

  const renderRateField = (
    label: string, 
    minRateField: keyof FormData, 
    excessRateField: keyof FormData, 
    extraField?: { field: keyof FormData, label: string }
  ) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
      <div className="col-span-2 md:col-span-1">
        <p className="text-sm font-medium mb-2">{label}</p>
      </div>
      <FormField
        control={form.control}
        name={minRateField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taxa Mínima (até 10kg)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={excessRateField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Excedente (por kg)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {extraField && (
        <div className="col-span-2 md:col-span-3">
          <FormField
            control={form.control}
            name={extraField.field}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{extraField.label}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Tabela</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="multiplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Multiplicador</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowCustomPricing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Permitir preços customizados</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defaultDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desconto padrão (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxas e Excedentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderRateField("Fortaleza Normal", "fortalezaNormalMinRate", "fortalezaNormalExcessRate")}
            {renderRateField("Fortaleza Emergencial", "fortalezaEmergencyMinRate", "fortalezaEmergencyExcessRate")}
            {renderRateField("Fortaleza Sábados", "fortalezaSaturdayMinRate", "fortalezaSaturdayExcessRate")}
            {renderRateField("Fortaleza Exclusivo", "fortalezaExclusiveMinRate", "fortalezaExclusiveExcessRate")}
            {renderRateField("Fortaleza Agendado/Difícil Acesso", "fortalezaScheduledMinRate", "fortalezaScheduledExcessRate")}
            
            <div className="space-y-2">
              {renderRateField("Região Metropolitana", "metropolitanMinRate", "metropolitanExcessRate")}
              <div className="px-4 text-sm text-muted-foreground">
                <p>Cidades da Região Metropolitana de Fortaleza:</p>
                <p>Aquiraz, Cascavel, Caucaia, Chorozinho, Eusébio, Guaiúba, Horizonte, Itaitinga, Maracanaú, Maranguape, Pacajus, Pacatuba, Pindoretama, São Gonçalo do Amarante</p>
              </div>
            </div>
            
            {renderRateField("Fortaleza Domingos e Feriados", "fortalezaHolidayMinRate", "fortalezaHolidayExcessRate")}
            {renderRateField("Material Biológico Normal", "biologicalNormalMinRate", "biologicalNormalExcessRate")}
            {renderRateField("Material Biológico Infeccioso", "biologicalInfectiousMinRate", "biologicalInfectiousExcessRate")}
            {renderRateField("Veículo Rastreado (até 100kg)", "trackedVehicleMinRate", "trackedVehicleExcessRate")}
            {renderRateField("Redespacho por Transportadora", "reshipmentMinRate", "reshipmentExcessRate", {
              field: "reshipmentInvoicePercentage",
              label: "Percentual sobre valor da Nota Fiscal (%)"
            })}
            {renderRateField("Exclusivo Interior (até 100kg por km)", "interiorExclusiveMinRate", "interiorExclusiveExcessRate", {
              field: "interiorExclusiveKmRate",
              label: "Valor por KM rodado"
            })}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="submit">
            {initialData ? 'Atualizar Tabela' : 'Criar Tabela'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
