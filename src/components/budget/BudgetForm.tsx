
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, calculateCubicWeight, getEffectiveWeight, DeliveryType } from '@/types/budget';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { useClients } from '@/contexts/clients/ClientsContext';
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { useFreightCalculation } from '@/hooks/useFreightCalculation';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { DialogFooter } from '@/components/ui/dialog';
import { Box, DollarSign, PackagePlus, Trash2, Plus, MapPin, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  onSubmit: (data: BudgetFormValues) => void;
  initialData?: BudgetFormValues;
  isSubmitting?: boolean;
}

export function BudgetForm({ onSubmit, initialData, isSubmitting = false }: BudgetFormProps) {
  const { clients } = useClients();
  const { priceTables } = usePriceTables();
  const { calculateFreight } = useFreightCalculation();
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(initialData?.clientId);
  const [effectiveWeights, setEffectiveWeights] = useState<{ id: string; weight: number }[]>([]);
  
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: initialData || {
      totalVolumes: 1,
      merchandiseValue: 0,
      hasCollection: false,
      hasDelivery: true,
      additionalServices: [],
      packages: [{ width: 0, length: 0, height: 0, weight: 0, quantity: 1 }],
      totalValue: 0
    }
  });

  const clientId = form.watch('clientId');
  const packages = form.watch('packages');
  const hasCollection = form.watch('hasCollection');
  const hasDelivery = form.watch('hasDelivery');
  const deliveryType = form.watch('deliveryType') as DeliveryType;
  const merchandiseValue = form.watch('merchandiseValue');
  const additionalServices = form.watch('additionalServices');

  // Get the selected client
  const selectedClient = clients.find(c => c.id === clientId);
  
  // Get the client's price table
  const clientPriceTable = priceTables.find(pt => selectedClient && pt.id === selectedClient.priceTableId);

  // Set up field arrays for packages and additional services
  const { fields: packageFields, append: appendPackage, remove: removePackage } = 
    useFieldArray({ control: form.control, name: "packages" });
  
  const { fields: serviceFields, append: appendService, remove: removeService } = 
    useFieldArray({ control: form.control, name: "additionalServices" });

  // Calculate cubic weight for each package
  useEffect(() => {
    if (packages && packages.length > 0) {
      const newEffectiveWeights = packages.map(pkg => {
        const { width, length, height, weight, id = String(Math.random()) } = pkg;
        const cubicWeight = calculateCubicWeight(width, length, height);
        const effectiveWeight = getEffectiveWeight(weight, cubicWeight);
        return { id, weight: effectiveWeight };
      });
      setEffectiveWeights(newEffectiveWeights);
    }
  }, [packages]);

  // Calculate total value whenever relevant fields change
  useEffect(() => {
    if (clientId && deliveryType && packages.length > 0 && clientPriceTable) {
      let totalValue = 0;
      
      // Calculate freight based on total effective weight
      const totalEffectiveWeight = effectiveWeights.reduce(
        (sum, item, index) => sum + item.weight * (packages[index]?.quantity || 1), 
        0
      );
      
      // Add delivery cost if applicable
      if (hasDelivery) {
        const deliveryCost = calculateFreight(
          clientId, 
          totalEffectiveWeight, 
          // Fixed: We need to pass "standard" for cargo type, not the delivery type
          "standard", 
          merchandiseValue
        );
        totalValue += deliveryCost;
      }
      
      // Add collection cost if applicable (using standard delivery type)
      if (hasCollection) {
        const collectionCost = calculateFreight(
          clientId, 
          totalEffectiveWeight, 
          // Fixed: We need to pass "standard" for cargo type, not the delivery type
          "standard",
          merchandiseValue
        );
        totalValue += collectionCost;
      }
      
      // Add additional services
      if (additionalServices && additionalServices.length > 0) {
        const servicesTotal = additionalServices.reduce(
          (sum, service) => sum + (service.value || 0), 
          0
        );
        totalValue += servicesTotal;
      }
      
      form.setValue('totalValue', totalValue);
    }
  }, [clientId, deliveryType, packages, effectiveWeights, hasCollection, hasDelivery, merchandiseValue, additionalServices, clientPriceTable, calculateFreight, form]);

  // Update total volumes when packages change
  useEffect(() => {
    if (packages) {
      const totalQuantity = packages.reduce((sum, pkg) => sum + (pkg.quantity || 1), 0);
      form.setValue('totalVolumes', totalQuantity);
    }
  }, [packages, form]);

  // When client changes, update the selected client ID
  useEffect(() => {
    if (clientId !== selectedClientId) {
      setSelectedClientId(clientId);
    }
  }, [clientId, selectedClientId]);

  const handleSubmit = (data: BudgetFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ClientSearchSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedClient && clientPriceTable && (
              <div className="text-sm">
                <p><strong>Tabela de Preços:</strong> {clientPriceTable.name}</p>
                <p className="text-muted-foreground">{clientPriceTable.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="deliveryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Entrega</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="standard" />
                        </FormControl>
                        <FormLabel className="font-normal">Padrão</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="emergency" />
                        </FormControl>
                        <FormLabel className="font-normal">Emergencial</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="exclusive" />
                        </FormControl>
                        <FormLabel className="font-normal">Veículo Exclusivo</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="metropolitanRegion" />
                        </FormControl>
                        <FormLabel className="font-normal">Região Metropolitana</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="doorToDoorInterior" />
                        </FormControl>
                        <FormLabel className="font-normal">Porta a Porta Interior</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="merchandiseValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Mercadoria (R$)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalVolumes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total de Volumes</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Box className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          min={1}
                          readOnly
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hasCollection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Incluir Coleta</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Adiciona custo de coleta ao orçamento
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasDelivery"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Incluir Entrega</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Adiciona custo de entrega ao orçamento
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {hasCollection && (
              <FormField
                control={form.control}
                name="collectionLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de Coleta</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Endereço de coleta"
                          className="pl-8"
                          {...field}
                          value={field.value || ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Volumes e Medidas</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPackage({ width: 0, length: 0, height: 0, weight: 0, quantity: 1 })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Volume
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {packageFields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                <div className="absolute right-2 top-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePackage(index)}
                    disabled={packageFields.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center mb-2">
                  <PackagePlus className="mr-2 h-5 w-5" />
                  <h3 className="text-lg font-medium">Volume {index + 1}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`packages.${index}.width`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Largura (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`packages.${index}.length`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comprimento (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`packages.${index}.height`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`packages.${index}.weight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso Real (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`packages.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {effectiveWeights[index] && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Peso Cubado: {calculateCubicWeight(
                          form.getValues(`packages.${index}.width`),
                          form.getValues(`packages.${index}.length`),
                          form.getValues(`packages.${index}.height`)
                        ).toFixed(2)} kg
                      </span>
                      <span className="text-sm font-medium">
                        Peso Real: {form.getValues(`packages.${index}.weight`).toFixed(2)} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Peso Considerado:</span>
                      <Badge variant="secondary">{effectiveWeights[index].weight.toFixed(2)} kg</Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Serviços Adicionais</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendService({ description: '', value: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Serviço
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum serviço adicional. Clique em "Adicionar Serviço" para incluir.
              </p>
            )}
            
            {serviceFields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                <div className="absolute right-2 top-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`additionalServices.${index}.description`}
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
                    name={`additionalServices.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              className="pl-8"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações sobre o orçamento..."
                      rows={3}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Valor Total:</span>
              <span className="text-xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.watch('totalValue'))}
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Progresso do orçamento</span>
                <span>{form.formState.isValid ? 'Completo' : 'Incompleto'}</span>
              </div>
              <Progress value={form.formState.isValid ? 100 : 60} />
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
            {isSubmitting ? "Processando..." : "Criar Orçamento"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
