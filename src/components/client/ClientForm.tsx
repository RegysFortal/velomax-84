
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Client } from '@/types';
import { usePriceTables } from '@/contexts/PriceTablesContext';
import { clientFormSchema, ClientFormValues } from './ClientFormSchema';
import { ClientBasicInfoFields } from './form-sections/ClientBasicInfoFields';
import { ContactInfoFields } from './form-sections/ContactInfoFields';
import { AddressInfoFields } from './form-sections/AddressInfoFields';
import { AdditionalInfoFields } from './form-sections/AdditionalInfoFields';

interface ClientFormProps {
  onSubmit: (data: ClientFormValues) => void;
  submitButtonLabel: string;
  initialData?: Client;
  isSubmitting?: boolean;
}

export function ClientForm({ 
  onSubmit, 
  submitButtonLabel, 
  initialData,
  isSubmitting = false 
}: ClientFormProps) {
  const { priceTables } = usePriceTables();
  
  // Log dos dados iniciais para debugging
  useEffect(() => {
    if (initialData) {
      console.log("Initial data loaded into form:", initialData);
      console.log("Price table ID from initial data:", initialData.priceTableId);
    }
    console.log("Available price tables:", priceTables);
  }, [initialData, priceTables]);
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      tradingName: initialData.tradingName || '',
      document: initialData.document || '',
      address: initialData.address || '',
      street: initialData.street || '',
      number: initialData.number || '',
      complement: initialData.complement || '',
      neighborhood: initialData.neighborhood || '',
      city: initialData.city || '',
      state: initialData.state || '',
      zipCode: initialData.zipCode || '',
      contact: initialData.contact || '',
      phone: initialData.phone || '',
      email: initialData.email || '',
      priceTableId: initialData.priceTableId || '',
      notes: initialData.notes || '',
    } : {
      name: "",
      tradingName: "",
      document: "",
      address: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      contact: "",
      phone: "",
      email: "",
      priceTableId: "",
      notes: "",
    }
  });

  // Log quando o formulário é submetido
  const handleSubmit = (data: ClientFormValues) => {
    console.log("Form submitted with data:", data);
    console.log("Price table ID at submission:", data.priceTableId);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ClientBasicInfoFields control={form.control} />
        <ContactInfoFields control={form.control} />
        <AddressInfoFields control={form.control} />
        <AdditionalInfoFields 
          control={form.control} 
          priceTables={priceTables} 
        />

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : submitButtonLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
