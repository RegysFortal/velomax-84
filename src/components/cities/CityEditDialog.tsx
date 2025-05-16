
import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { City } from '@/types';
import { cityFormSchema } from './CityFormSchema';

interface CityEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCity: City | undefined;
  onUpdateCity: (data: { name: string; state: string; distance: number }) => void;
}

export function CityEditDialog({ 
  open, 
  onOpenChange, 
  selectedCity, 
  onUpdateCity 
}: CityEditDialogProps) {
  const form = useForm<z.infer<typeof cityFormSchema>>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: "",
      state: "",
      distance: 0,
    },
  });

  // Update form values when selected city changes
  useEffect(() => {
    if (selectedCity) {
      form.setValue("name", selectedCity.name);
      form.setValue("state", selectedCity.state);
      form.setValue("distance", selectedCity.distance);
    }
  }, [selectedCity, form]);

  const handleSubmit = (data: z.infer<typeof cityFormSchema>) => {
    onUpdateCity(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar cidade</DialogTitle>
          <DialogDescription>
            Edite os dados da cidade.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distância (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Distância da cidade"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Atualizar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
