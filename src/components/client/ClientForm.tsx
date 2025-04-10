
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
import { usePriceTables } from '@/contexts/priceTables'; // Fixed import path
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
  onCancel?: () => void; // Added onCancel prop
}

export function ClientForm({ 
  onSubmit, 
  submitButtonLabel, 
  initialData,
  isSubmitting = false,
  onCancel 
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

  // Monitor de mudanças para acompanhar alterações no formulário
  const watchPriceTableId = form.watch("priceTableId");
  useEffect(() => {
    console.log("Form price table ID changed to:", watchPriceTableId);
  }, [watchPriceTableId]);

  // Log quando o formulário é submetido
  const handleSubmit = (data: ClientFormValues) => {
    console.log("Form submitted with data:", data);
    console.log("Price table ID at submission:", data.priceTableId);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={(e) => {
          console.log("Form onSubmit triggered");
          // Previne comportamentos padrão que possam fechar o diálogo
          e.stopPropagation();
          form.handleSubmit(handleSubmit)(e);
        }} 
        className="space-y-4"
        onClick={(e) => {
          // Previne propagação de cliques que possam fechar o diálogo
          e.stopPropagation();
        }}
      >
        <ClientBasicInfoFields control={form.control} />
        <ContactInfoFields control={form.control} />
        <AddressInfoFields control={form.control} />
        <AdditionalInfoFields 
          control={form.control} 
          priceTables={priceTables} 
        />

        <DialogFooter>
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="mr-2"
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={(e) => {
              // Este é um handler adicional para garantir que o clique no botão não feche o diálogo
              e.stopPropagation();
            }}
          >
            {isSubmitting ? "Processando..." : submitButtonLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
