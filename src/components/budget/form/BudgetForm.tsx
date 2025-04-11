
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Budget } from '@/types/budget';
import { useBudgetForm } from './useBudgetForm';
import { ClientInfoSection } from './ClientInfoSection';
import { PackageSection } from './PackageSection';
import { ServicesSection } from './ServicesSection';
import { BudgetSummary } from './BudgetSummary';

interface BudgetFormProps {
  initialData?: Budget;
  onSubmit: (data: Budget) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function BudgetForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: BudgetFormProps) {
  const {
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
  } = useBudgetForm({
    initialData,
    onSubmit
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ClientInfoSection form={form} />
          </div>

          <div className="space-y-6">
            <PackageSection 
              form={form}
              packageFields={packageFields}
              packageCalculations={packageCalculations}
              onAddPackage={onAddPackage}
              onRemovePackage={removePackage}
            />

            <ServicesSection 
              form={form}
              serviceFields={serviceFields}
              onAddService={onAddService}
              onRemoveService={removeService}
            />

            <BudgetSummary 
              form={form} 
              priceTable={priceTable} 
            />
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
