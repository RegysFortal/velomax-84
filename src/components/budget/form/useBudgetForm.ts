
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, Budget, PackageMeasurement } from '@/types/budget';
import { useClients, usePriceTables } from '@/contexts';
import { useBudgetCalculations } from '../hooks/useBudgetCalculations';
import { BudgetFormValues, getInitialFormValues } from './BudgetFormSchema';

interface UseBudgetFormProps {
  initialData?: Budget;
  onSubmit: (data: Budget) => void;
}

export function useBudgetForm({ initialData, onSubmit }: UseBudgetFormProps) {
  const { clients } = useClients();
  const { priceTables } = usePriceTables();
  const { calculatePackageWeights } = useBudgetCalculations();
  
  const [selectedClient, setSelectedClient] = useState(clients.find(c => c.id === initialData?.clientId));
  const [priceTableId, setPriceTableId] = useState(selectedClient?.priceTableId || '');
  const [priceTable, setPriceTable] = useState(priceTables.find(pt => pt.id === priceTableId));
  const [packageCalculations, setPackageCalculations] = useState<Array<{
    realWeight: number;
    cubicWeight: number;
    effectiveWeight: number;
  }>>([{ realWeight: 0, cubicWeight: 0, effectiveWeight: 0 }]);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: getInitialFormValues(initialData),
  });

  const { fields: packageFields, append: appendPackage, remove: removePackage } = useFieldArray({
    control: form.control,
    name: "packages",
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "additionalServices",
  });

  const watchPackages = form.watch("packages");
  const watchClientId = form.watch("clientId");
  
  // Update selected client and price table when client changes
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

  // Update total volumes and package calculations when packages change
  useEffect(() => {
    const totalVolumes = watchPackages.reduce((sum, pkg) => sum + (pkg.quantity || 1), 0);
    form.setValue("totalVolumes", totalVolumes);
    
    const calculations = watchPackages.map(pkg => calculatePackageWeights(pkg));
    setPackageCalculations(calculations);
  }, [watchPackages, form, calculatePackageWeights]);

  const onAddPackage = () => {
    appendPackage({ width: 0, length: 0, height: 0, weight: 0, quantity: 1 });
    setPackageCalculations([...packageCalculations, { realWeight: 0, cubicWeight: 0, effectiveWeight: 0 }]);
  };

  const onAddService = () => {
    appendService({ description: '', value: 0 });
  };

  const handleFormSubmit = (data: BudgetFormValues) => {
    onSubmit(data as Budget);
  };

  return {
    form,
    packageFields,
    serviceFields,
    packageCalculations,
    priceTable,
    onAddPackage,
    onAddService,
    removePackage,
    removeService,
    handleFormSubmit
  };
}
