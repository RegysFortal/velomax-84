
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  licenseNumber: z.string().min(1, { message: 'Número da CNH é obrigatório' }),
  licenseCategory: z.string().min(1, { message: 'Categoria da CNH é obrigatória' }),
  expirationDate: z.string().min(1, { message: 'Data de vencimento é obrigatória' }),
  issueDate: z.string().min(1, { message: 'Data de emissão é obrigatória' }),
});

interface DriverLicenseFormProps {
  data?: any;
  onComplete: (data: any) => void;
}

export function DriverLicenseForm({ data, onComplete }: DriverLicenseFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseNumber: data?.licenseNumber || '',
      licenseCategory: data?.licenseCategory || '',
      expirationDate: data?.expirationDate ? new Date(data.expirationDate).toISOString().split('T')[0] : '',
      issueDate: data?.issueDate ? new Date(data.issueDate).toISOString().split('T')[0] : '',
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    onComplete({
      license: {
        licenseNumber: formData.licenseNumber,
        licenseCategory: formData.licenseCategory,
        expirationDate: formData.expirationDate,
        issueDate: formData.issueDate,
      }
    });
  };

  return (
    <ScrollArea className="max-h-[450px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da CNH</FormLabel>
                  <FormControl>
                    <Input placeholder="Número da CNH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="licenseCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="AD">AD</SelectItem>
                      <SelectItem value="AE">AE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit">Próximo</Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
