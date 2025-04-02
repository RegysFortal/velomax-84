
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useShipments } from "@/contexts/ShipmentsContext";
import { Shipment, TransportMode } from "@/types/shipment";
import { toast } from "sonner";
import { format } from "date-fns";

const shipmentSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  transportMode: z.enum(["air", "road"] as const),
  carrierName: z.string().min(2, "Nome da transportadora é obrigatório"),
  trackingNumber: z.string().min(2, "Número do conhecimento é obrigatório"),
  packages: z.coerce.number().min(1, "Número de volumes deve ser pelo menos 1"),
  weight: z.coerce.number().min(0.1, "Peso deve ser maior que 0"),
  arrivalFlight: z.string().optional(),
  arrivalDate: z.string().optional(),
  observations: z.string().optional(),
  isPriority: z.boolean().default(false),
  deliveryDate: z.string().optional(),
  deliveryTime: z.string().optional(),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

interface ShipmentDialogProps {
  open: boolean;
  onClose: () => void;
  shipment?: Shipment;
}

export function ShipmentDialog({ open, onClose, shipment }: ShipmentDialogProps) {
  const { addShipment, updateShipment } = useShipments();
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!shipment;
  
  // Default values for the form
  const defaultValues: Partial<ShipmentFormValues> = {
    companyName: shipment?.companyName || "",
    transportMode: shipment?.transportMode || "road",
    carrierName: shipment?.carrierName || "",
    trackingNumber: shipment?.trackingNumber || "",
    packages: shipment?.packages || 1,
    weight: shipment?.weight || 0,
    arrivalFlight: shipment?.arrivalFlight || "",
    arrivalDate: shipment?.arrivalDate || format(new Date(), "yyyy-MM-dd"),
    observations: shipment?.observations || "",
    isPriority: shipment?.isPriority || false,
    deliveryDate: shipment?.deliveryDate || "",
    deliveryTime: shipment?.deliveryTime || "",
  };
  
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: ShipmentFormValues) => {
    setIsLoading(true);
    
    try {
      if (isEditing && shipment) {
        await updateShipment(shipment.id, {
          ...data,
          companyId: shipment.companyId // Keep original company ID
        });
        toast.success("Embarque atualizado com sucesso!");
      } else {
        await addShipment({
          ...data,
          companyId: "temp-id", // In a real app, this would come from a company selection
          status: "in_transit",
          isRetained: false
        });
        toast.success("Embarque cadastrado com sucesso!");
      }
      
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error saving shipment:", error);
      toast.error("Erro ao salvar o embarque");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Embarque" : "Novo Embarque"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transportMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modo de Transporte</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o modo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="air">Aéreo</SelectItem>
                        <SelectItem value="road">Rodoviário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="carrierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transportadora</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da transportadora/cia aérea" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="trackingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Conhecimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Conhecimento/AWB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="packages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volumes</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0.1} step={0.1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="arrivalFlight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voo/Veículo</FormLabel>
                    <FormControl>
                      <Input placeholder="Número do voo ou veículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="arrivalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Chegada</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informações adicionais como perecível, biológico, entrega dedicada, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Inclua detalhes importantes sobre a carga, como necessidades especiais
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="isPriority"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Prioritário</FormLabel>
                      <FormDescription>
                        Marcar como entrega prioritária
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Entrega</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Entrega</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Salvando...
                  </>
                ) : isEditing ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
