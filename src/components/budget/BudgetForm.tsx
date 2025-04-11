
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
import { formatCurrency } from '@/lib/utils';
import { X, Plus, Calculator, Trash2 } from 'lucide-react';
import { usePriceTables } from '@/contexts/priceTables';
import { useBudgetCalculation } from '@/hooks/useBudgetCalculation';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BudgetFormProps {
  initialData?: Budget;
  onSubmit: (data: Budget) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function BudgetForm({ initialData, onSubmit, onCancel, isSubmitting = false }: BudgetFormProps) {
  const { clients } = useClients();
  const { toast } = useToast();
  const { priceTables } = usePriceTables();
  const { calculatePackageWeights } = useBudgetCalculation();
  const [selectedClient, setSelectedClient] = useState(clients.find(c => c.id === initialData?.clientId));
  const [priceTableId, setPriceTableId] = useState(selectedClient?.priceTableId || '');
  const [priceTable, setPriceTable] = useState(priceTables.find(pt => pt.id === priceTableId));
  const [packageCalculations, setPackageCalculations] = useState<Array<{
    realWeight: number;
    cubicWeight: number;
    effectiveWeight: number;
  }>>([{ realWeight: 0, cubicWeight: 0, effectiveWeight: 0 }]);

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
  const watchClientId = form.watch("clientId");
  const watchMerchandiseValue = form.watch("merchandiseValue");

  // Update client and price table when client changes
  useEffect(() => {
    const client = clients.find(c => c.id === watchClientId);
    setSelectedClient(client);
    
    if (client?.priceTableId) {
      setPriceTableId(client.priceTableId);
      const pt = priceTables.find(pt => pt.id === client.priceTableId);
      setPriceTable(pt);
    } else {
      setPriceTableId('');
      setPriceTable(undefined);
    }
  }, [watchClientId, clients, priceTables]);

  // Update total volumes when packages change
  useEffect(() => {
    const totalVolumes = watchPackages.reduce((sum, pkg) => sum + (pkg.quantity || 1), 0);
    form.setValue("totalVolumes", totalVolumes);
    
    // Calculate package weights
    const calculations = watchPackages.map(pkg => calculatePackageWeights(pkg));
    setPackageCalculations(calculations);
  }, [watchPackages, form, calculatePackageWeights]);

  const onAddPackage = () => {
    append({ width: 0, length: 0, height: 0, weight: 0, quantity: 1 });
    setPackageCalculations([...packageCalculations, { realWeight: 0, cubicWeight: 0, effectiveWeight: 0 }]);
  };

  const onAddService = () => {
    appendService({ description: '', value: 0 });
  };

  const calculatePackageDetails = (index: number) => {
    const pkg = watchPackages[index];
    if (pkg.weight) {
      const { realWeight, cubicWeight, effectiveWeight } = calculatePackageWeights(pkg);
      
      toast({
        title: `Detalhes do Volume ${index + 1}`,
        description: (
          <div className="space-y-1 mt-2">
            <p>Peso real: {realWeight} kg</p>
            <p>Peso cúbico: {cubicWeight} kg</p>
            <p>Peso considerado: {effectiveWeight} kg</p>
            <p>Quantidade: {pkg.quantity || 1}</p>
            <p>Total: {effectiveWeight * (pkg.quantity || 1)} kg</p>
          </div>
        ),
      });
    } else {
      toast({
        title: "Dados incompletos",
        description: "Preencha pelo menos o peso do volume para calcular.",
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
                    <SelectContent className="max-h-52 overflow-y-auto">
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
                      placeholder="Digite o valor da mercadoria"
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
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`packages.${index}.weight`}>Peso (kg)</Label>
                          <Input
                            id={`packages.${index}.weight`}
                            type="number"
                            step="0.01"
                            placeholder="Peso real"
                            {...form.register(`packages.${index}.weight` as const, {
                              valueAsNumber: true,
                            })}
                          />
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
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
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
                      </div>
                      
                      {packageCalculations[index] && (
                        <div className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <span className="block">Peso real:</span>
                              <span className="font-medium">{packageCalculations[index].realWeight} kg</span>
                            </div>
                            <div>
                              <span className="block">Peso cubado:</span>
                              <span className="font-medium">{packageCalculations[index].cubicWeight} kg</span>
                            </div>
                            <div>
                              <span className="block">Peso considerado:</span>
                              <span className="font-medium">{packageCalculations[index].effectiveWeight} kg</span>
                            </div>
                          </div>
                        </div>
                      )}
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
                    <Trash2 className="h-4 w-4 text-destructive" />
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
                  {watchHasCollection && watchHasDelivery && (
                    <div className="flex justify-between text-amber-600">
                      <span>Coleta + Entrega:</span>
                      <span>Valor x2</span>
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? 'Atualizar Orçamento' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
