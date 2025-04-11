
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PackageMeasurement } from '@/types/budget';
import { Plus, Calculator, Trash2 } from 'lucide-react';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { BudgetFormValues } from './BudgetFormSchema';
import { useBudgetCalculations } from '../hooks/useBudgetCalculations';

interface PackageSectionProps {
  form: UseFormReturn<BudgetFormValues>;
  packageFields: FieldArrayWithId<BudgetFormValues, "packages", "id">[];
  packageCalculations: Array<{
    realWeight: number;
    cubicWeight: number;
    effectiveWeight: number;
  }>;
  onAddPackage: () => void;
  onRemovePackage: (index: number) => void;
}

export function PackageSection({
  form,
  packageFields,
  packageCalculations,
  onAddPackage,
  onRemovePackage
}: PackageSectionProps) {
  const { toast } = useToast();
  const { calculatePackageWeights } = useBudgetCalculations();

  const calculatePackageDetails = (index: number) => {
    const pkg = form.getValues().packages[index];
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
      
      {packageFields.map((field, index) => (
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
                {packageFields.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemovePackage(index)}
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
  );
}
