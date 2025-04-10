import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useClients } from '@/contexts';
import { useToast } from '@/hooks/use-toast';
import { Budget, PackageMeasurement, budgetSchema, calculateCubicWeight, getEffectiveWeight, DeliveryType } from '@/types/budget';
import { calculateFreight } from '@/lib/freight-calculator';
import { formatCurrency } from '@/lib/utils';
import { X, Plus, Calculator } from 'lucide-react';
import { usePriceTables } from '@/contexts/priceTables';

interface BudgetFormProps {
  initialData?: Budget;
  onSubmit: (data: Budget) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const mapDeliveryTypeToFreightType = (deliveryType: DeliveryType): "standard" | "perishable" => {
  if (deliveryType === "normalBiological" || deliveryType === "infectiousBiological") {
    return "perishable";
  }
  return "standard";
};

export function BudgetForm({ initialData, onSubmit, onCancel }: BudgetFormProps) {
  const { clients } = useClients();
  const { toast } = useToast();
  const { priceTables } = usePriceTables();
  const [selectedClient, setSelectedClient] = useState(clients.find(c => c.id === initialData?.clientId));
  const [priceTableId, setPriceTableId] = useState(selectedClient?.priceTableId || '');
  const [priceTable, setPriceTable] = useState(priceTables.find(pt => pt.id === priceTableId));

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: initialData || {
      clientId: '',
      totalVolumes: 1,
      deliveryType: 'standard',
      merchandiseValue: 0,
      hasCollection: false,
      hasDelivery: true,
      additionalServices: [],
      packages: [{ width: 0, length: 0, height: 0, weight: 0, quantity: 1 }],
      totalValue: 0,
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "packages",
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "additionalServices",
  });

  const watchPackages = form.watch("packages");
  const watchDeliveryType = form.watch("deliveryType");
  const watchHasCollection = form.watch("hasCollection");
  const watchHasDelivery = form.watch("hasDelivery");
  const watchAdditionalServices = form.watch("additionalServices");

  useEffect(() => {
    const clientId = form.getValues("clientId");
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    
    if (client?.priceTableId) {
      setPriceTableId(client.priceTableId);
      const pt = priceTables.find(pt => pt.id === client.priceTableId);
      setPriceTable(pt);
    } else {
      setPriceTableId('');
      setPriceTable(undefined);
    }
  }, [form.watch("clientId"), clients, priceTables]);

  useEffect(() => {
    const totalVolumes = watchPackages.reduce((sum, pkg) => sum + (pkg.quantity || 1), 0);
    form.setValue("totalVolumes", totalVolumes);
  }, [watchPackages, form]);

  useEffect(() => {
    let totalValue = 0;
    
    watchPackages.forEach(pkg => {
      if (pkg.width && pkg.length && pkg.height && pkg.weight) {
        const cubicWeight = calculateCubicWeight(pkg.width, pkg.length, pkg.height);
        const effectiveWeight = getEffectiveWeight(pkg.weight, cubicWeight);
        
        const freightType = mapDeliveryTypeToFreightType(watchDeliveryType as DeliveryType);
        const packageFreight = calculateFreight(freightType, effectiveWeight);
        
        const multiplier = priceTable?.multiplier || 1;
        totalValue += packageFreight * multiplier * (pkg.quantity || 1);
      }
    });
    
    watchAdditionalServices.forEach(service => {
      if (service.value) {
        totalValue += service.value;
      }
    });
    
    switch (watchDeliveryType) {
      case 'emergency':
        totalValue *= 1.5;
        break;
      case 'exclusive':
        totalValue *= 2;
        break;
      case 'saturday':
        totalValue *= 1.3;
        break;
      case 'sundayHoliday':
        totalValue *= 1.5;
        break;
      case 'difficultAccess':
        totalValue *= 1.2;
        break;
      case 'infectiousBiological':
        totalValue *= 1.5;
        break;
    }
    
    if (watchHasCollection) {
      totalValue += 50;
    }
    
    if (!watchHasDelivery) {
      totalValue *= 0.7;
    }
    
    form.setValue("totalValue", parseFloat(totalValue.toFixed(2)));
  }, [watchPackages, watchDeliveryType, watchHasCollection, watchHasDelivery, watchAdditionalServices, priceTable, form]);

  const onAddPackage = () => {
    append({ width: 0, length: 0, height: 0, weight: 0, quantity: 1 });
  };

  const onAddService = () => {
    appendService({ description: '', value: 0 });
  };

  const calculatePackageDetails = (index: number) => {
    const pkg = watchPackages[index];
    if (pkg.width && pkg.length && pkg.height && pkg.weight) {
      const cubicWeight = calculateCubicWeight(pkg.width, pkg.length, pkg.height);
      const effectiveWeight = getEffectiveWeight(pkg.weight, cubicWeight);
      
      const freightType = mapDeliveryTypeToFreightType(watchDeliveryType as DeliveryType);
      const packageFreight = calculateFreight(freightType, effectiveWeight);
      
      const multiplier = priceTable?.multiplier || 1;
      const totalPackageValue = packageFreight * multiplier * (pkg.quantity || 1);
      
      toast({
        title: `Detalhes do Volume ${index + 1}`,
        description: (
          <div className="space-y-1 mt-2">
            <p>Peso real: {pkg.weight} kg</p>
            <p>Peso cúbico: {cubicWeight.toFixed(2)} kg</p>
            <p>Peso considerado: {effectiveWeight.toFixed(2)} kg</p>
            <p>Valor unitário: {formatCurrency(packageFreight * multiplier)}</p>
            <p>Valor total: {formatCurrency(totalPackageValue)}</p>
            {priceTable && <p>Tabela aplicada: {priceTable.name} ({multiplier}x)</p>}
          </div>
        ),
      });
    } else {
      toast({
        title: "Dados incompletos",
        description: "Preencha todas as dimensões e peso do volume para calcular.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Entrega</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de entrega" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Padrão</SelectItem>
                      <SelectItem value="emergency">Emergencial</SelectItem>
                      <SelectItem value="exclusive">Exclusiva</SelectItem>
                      <SelectItem value="metropolitanRegion">Região Metropolitana</SelectItem>
                      <SelectItem value="doorToDoorInterior">Porta a Porta Interior</SelectItem>
                      <SelectItem value="saturday">Sábado</SelectItem>
                      <SelectItem value="sundayHoliday">Domingo/Feriado</SelectItem>
                      <SelectItem value="difficultAccess">Difícil Acesso</SelectItem>
                      <SelectItem value="reshipment">Reentrega</SelectItem>
                      <SelectItem value="normalBiological">Material Biológico Normal</SelectItem>
                      <SelectItem value="infectiousBiological">Material Biológico Infectante</SelectItem>
                      <SelectItem value="tracked">Rastreada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="merchandiseValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Mercadoria (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                      <FormLabel>Coleta</FormLabel>
                      <FormDescription>
                        Inclui serviço de coleta
                      </FormDescription>
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
                      <FormLabel>Entrega</FormLabel>
                      <FormDescription>
                        Inclui serviço de entrega
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {watchHasCollection && (
              <FormField
                control={form.control}
                name="collectionLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de Coleta</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Volumes</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={onAddPackage}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Volume
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <Card key={field.id} className="mb-4">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Volume {index + 1}</h4>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => calculatePackageDetails(index)}
                        >
                          <Calculator className="h-4 w-4" />
                        </Button>
                        {fields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <Label htmlFor={`packages.${index}.width`}>Largura (cm)</Label>
                        <Input
                          id={`packages.${index}.width`}
                          type="number"
                          step="0.01"
                          {...form.register(`packages.${index}.width` as const, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`packages.${index}.length`}>Comprimento (cm)</Label>
                        <Input
                          id={`packages.${index}.length`}
                          type="number"
                          step="0.01"
                          {...form.register(`packages.${index}.length` as const, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <Label htmlFor={`packages.${index}.height`}>Altura (cm)</Label>
                        <Input
                          id={`packages.${index}.height`}
                          type="number"
                          step="0.01"
                          {...form.register(`packages.${index}.height` as const, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`packages.${index}.weight`}>Peso (kg)</Label>
                        <Input
                          id={`packages.${index}.weight`}
                          type="number"
                          step="0.01"
                          {...form.register(`packages.${index}.weight` as const, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`packages.${index}.quantity`}>Quantidade</Label>
                      <Input
                        id={`packages.${index}.quantity`}
                        type="number"
                        min="1"
                        {...form.register(`packages.${index}.quantity` as const, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Serviços Adicionais</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={onAddService}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Serviço
                </Button>
              </div>
              
              {serviceFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 mb-2">
                  <div className="flex-1">
                    <Label htmlFor={`additionalServices.${index}.description`}>Descrição</Label>
                    <Input
                      id={`additionalServices.${index}.description`}
                      {...form.register(`additionalServices.${index}.description` as const)}
                    />
                  </div>
                  <div className="w-1/3">
                    <Label htmlFor={`additionalServices.${index}.value`}>Valor (R$)</Label>
                    <Input
                      id={`additionalServices.${index}.value`}
                      type="number"
                      step="0.01"
                      {...form.register(`additionalServices.${index}.value` as const, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeService(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Resumo</h3>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Total de volumes:</span>
                    <span>{form.getValues("totalVolumes")}</span>
                  </div>
                  {priceTable && (
                    <div className="flex justify-between">
                      <span>Tabela de preços:</span>
                      <span>{priceTable.name} ({priceTable.multiplier}x)</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Valor total:</span>
                    <span>{formatCurrency(form.getValues("totalValue"))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? 'Atualizar Orçamento' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
